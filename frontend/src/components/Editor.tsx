import { useState, useEffect, useRef, useCallback } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { userManager } from '../utils/user'
import { storage } from '../utils/storage'
import { collaborationService } from '../utils/collaboration'
import { api } from '../utils/api'
import { User, Version, Review, Comment } from '../types'
import { v4 as uuidv4 } from 'uuid'
import './Editor.css'

// 扩展 Quill 以支持自定义格式
const Block = Quill.import('blots/block')
Block.tagName = 'div'
Quill.register(Block, true)

const Editor = () => {
  const [content, setContent] = useState<string>('')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [currentUser] = useState(userManager.getCurrentUser())
  const [collaborators, setCollaborators] = useState<User[]>([])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [versions, setVersions] = useState<Version[]>([])
  const [showVersions, setShowVersions] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(true)
  const quillRef = useRef<ReactQuill>(null)

  // 初始化 - 从后端加载当前文章
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // 从后端获取当前文章
        const article = await api.getCurrentArticle()
        if (article && typeof article === 'object' && 'content' in article &&
          typeof article.content === 'string') {
          setContent(article.content)
          // 同时保存到 localStorage 作为本地备份
          storage.save(article.content)
        } else {
          // 如果后端没有内容，尝试从 localStorage 加载
          storage.clear()
          setContent("")
        }

        // 从后端加载版本历史（所有 articles，按 id 倒序）
        const backendArticles = await api.getAllArticles()
        setVersions(backendArticles.map((a: any) => ({
          id: a.id,
          timestamp: a.timestamp,
          content: a.content,
          author: a.author
        })))

        // 从后端加载批注
        const backendComments = await api.getComments()
        setComments(backendComments.map((c: any) => ({
          id: c.id,
          text: c.text,
          targetText: c.target_text,
          startIndex: c.start_index,
          endIndex: c.end_index,
          author: c.author,
          timestamp: c.timestamp,
          replies: [] // 后端暂不支持回复，保留空数组
        })))
      } catch (error) {
        console.error('加载数据失败:', error)
        // 如果后端请求失败，尝试从 localStorage 加载
        const savedContent = storage.load()
        if (savedContent) {
          setContent(savedContent)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // 连接协同服务
    collaborationService.connect(currentUser)

    // 监听协同事件
    collaborationService.on('user-joined', (user: User) => {
      setCollaborators(prev => {
        if (!prev.find(u => u.id === user.id)) {
          return [...prev, user]
        }
        return prev
      })
    })

    collaborationService.on('user-left', (userId: string) => {
      setCollaborators(prev => prev.filter(u => u.id !== userId))
    })

    collaborationService.on('cursor-update', ({ userId, cursor }: { userId: string; cursor: any }) => {
      setCollaborators(prev => prev.map(u =>
        u.id === userId ? { ...u, cursor } : u
      ))
    })

    collaborationService.on('content-update', () => {
      // 在实际项目中，这里应该使用 Yjs 等协同编辑库
      // 这里只是演示
    })

    return () => {
      collaborationService.disconnect()
    }
  }, [])

  // 更新字数统计
  useEffect(() => {
    const text = quillRef.current?.getEditor().getText() || ''
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
    setCharCount(text.length)
  }, [content])

  // 内容变化处理 - 只保存到 localStorage，不提交到后端
  const handleChange = useCallback((value: string) => {
    setContent(value)
    // 保存到 localStorage（未提交的内容）
    storage.save(value)

    // 更新光标位置
    const editor = quillRef.current?.getEditor()
    if (editor) {
      const selection = editor.getSelection()
      if (selection) {
        collaborationService.updateCursor(currentUser.id, {
          index: selection.index,
          length: selection.length
        })
      }
    }
  }, [currentUser.id])

  // 清空内容
  const handleClear = () => {
    if (window.confirm('确定要清空所有内容吗？')) {
      setContent('')
      storage.clear()
      if (quillRef.current) {
        quillRef.current.getEditor().setText('')
      }
    }
  }

  // 保存版本 - 保存 article 到后端（创建新记录）
  const handleSaveVersion = async () => {
    try {
      const article = await api.saveArticle(content)
      if (article) {
        // 重新获取所有文章作为版本历史
        const allArticles = await api.getAllArticles()
        setVersions(allArticles.map((a: any) => ({
          id: a.id,
          timestamp: a.timestamp,
          content: a.content,
          author: a.author
        })))
        alert('版本已保存')
      }
    } catch (error) {
      console.error('保存版本失败:', error)
      alert('保存版本失败，请重试')
    }
  }

  // 恢复版本
  const handleRestoreVersion = (version: Version) => {
    if (window.confirm('确定要恢复此版本吗？当前内容将被替换。')) {
      setContent(version.content)
      if (quillRef.current) {
        const delta = quillRef.current.getEditor().clipboard.convert(version.content)
        quillRef.current.getEditor().setContents(delta, 'api')
      }
      storage.save(version.content)
    }
  }

  // 添加审阅
  const handleAddReview = () => {
    const editor = quillRef.current?.getEditor()
    if (!editor) return

    const selection = editor.getSelection()
    if (!selection || selection.length === 0) {
      alert('请先选择要审阅的文本')
      return
    }

    const text = editor.getText(selection.index, selection.length)
    const review: Review = {
      id: uuidv4(),
      text,
      startIndex: selection.index,
      endIndex: selection.index + selection.length,
      author: currentUser.name,
      timestamp: Date.now(),
      status: 'pending',
      comments: []
    }

    setReviews(prev => [...prev, review])

    // 高亮标记
    editor.formatText(selection.index, selection.length, 'background', '#ffeb3b')
  }

  // 添加审阅评论
  const handleAddReviewComment = (reviewId: string) => {
    const commentText = window.prompt('请输入审阅意见：')
    if (!commentText) return

    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: [
            ...review.comments,
            {
              id: uuidv4(),
              text: commentText,
              author: currentUser.name,
              timestamp: Date.now()
            }
          ]
        }
      }
      return review
    }))
  }

  // 解决审阅
  const handleResolveReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return { ...review, status: 'resolved' as const }
      }
      return review
    }))
  }

  // 添加批注 - 提交到后端
  const handleAddComment = async () => {
    const editor = quillRef.current?.getEditor()
    if (!editor) return

    const selection = editor.getSelection()
    if (!selection || selection.length === 0) {
      alert('请先选择要批注的文本')
      return
    }

    const targetText = editor.getText(selection.index, selection.length)
    const commentText = window.prompt('请输入批注内容：')
    if (!commentText) return

    try {
      const comment = await api.saveComment({
        text: commentText,
        target_text: targetText,
        start_index: selection.index,
        end_index: selection.index + selection.length
      }) as Comment;

      if (comment) {
        // 添加到本地批注列表
        setComments(prev => [{
          id: comment.id,
          text: comment.text,
          targetText: comment.targetText,
          startIndex: comment.startIndex,
          endIndex: comment.endIndex,
          author: comment.author,
          timestamp: comment.timestamp,
          replies: []
        }, ...prev])
      }
    } catch (error) {
      console.error('保存批注失败:', error)
      alert('保存批注失败，请重试')
    }
  }

  // 回复批注（本地功能，暂不提交到后端）
  const handleReplyComment = (commentId: string) => {
    const replyText = window.prompt('请输入回复内容：')
    if (!replyText) return

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: uuidv4(),
              text: replyText,
              author: currentUser.name,
              timestamp: Date.now()
            }
          ]
        }
      }
      return comment
    }))
  }

  // Quill 模块配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'size', 'list', 'bullet',
    'align', 'link', 'image'
  ]

  if (loading) {
    return (
      <div className="editor-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
      </div>
    )
  }

  return (
    <div className="editor-container">
      {/* 工具栏 */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <h1>协同文本编辑器</h1>
        </div>
        <div className="toolbar-right">
          <button onClick={handleClear} className="btn btn-secondary">清空</button>
          <button onClick={handleSaveVersion} className="btn btn-primary">保存版本</button>
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="btn btn-secondary"
          >
            版本历史
          </button>
          <button
            onClick={() => setIsReviewMode(!isReviewMode)}
            className={`btn ${isReviewMode ? 'btn-active' : 'btn-secondary'}`}
          >
            审阅模式
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-secondary"
          >
            批注 ({comments.length})
          </button>
          {isReviewMode && (
            <button onClick={handleAddReview} className="btn btn-primary">
              添加审阅
            </button>
          )}
          <button onClick={handleAddComment} className="btn btn-primary">
            添加批注
          </button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div className="editor-main">
        {/* 侧边栏 */}
        <div className={`sidebar ${showComments ? 'sidebar-open' : ''}`}>
          {showComments && (
            <div className="comments-panel">
              <h3>批注列表</h3>
              {comments.length === 0 ? (
                <p className="empty-state">暂无批注</p>
              ) : (
                <div className="comments-list">
                  {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-time">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="comment-target">
                        批注文本: "{comment.targetText}"
                      </div>
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="comment-reply">
                            <span className="reply-author">{reply.author}:</span>
                            <span className="reply-text">{reply.text}</span>
                          </div>
                        ))}
                        <button
                          onClick={() => handleReplyComment(comment.id)}
                          className="btn btn-small"
                          style={{ marginTop: '8px' }}
                        >
                          回复
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 编辑器 */}
        <div className="editor-content">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder="开始输入..."
            readOnly={false}
          />
        </div>

        {/* 版本历史面板 */}
        {showVersions && (
          <div className="versions-panel">
            <div className="panel-header">
              <h3>版本历史</h3>
              <button onClick={() => setShowVersions(false)} className="close-btn">×</button>
            </div>
            <div className="versions-list">
              {versions.length === 0 ? (
                <p className="empty-state">暂无版本历史</p>
              ) : (
                versions.slice().reverse().map(version => (
                  <div key={version.id} className="version-item">
                    <div className="version-info">
                      <span className="version-author">{version.author}</span>
                      <span className="version-time">
                        {new Date(version.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRestoreVersion(version)}
                      className="btn btn-small"
                    >
                      恢复
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="editor-footer">
        <div className="status-left">
          <span>字数: {wordCount} 字</span>
          <span>字符: {charCount} 字符</span>
        </div>
        <div className="status-right">
          <span>当前用户: {currentUser.name}</span>
          {collaborators.length > 0 && (
            <div className="collaborators">
              <span>协作者: </span>
              {collaborators.map(user => (
                <span
                  key={user.id}
                  className="collaborator-badge"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 审阅列表 */}
      {reviews.length > 0 && (
        <div className="reviews-panel">
          <h3>审阅列表 ({reviews.length})</h3>
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-status">{review.status === 'pending' ? '待审阅' : '已解决'}</span>
              </div>
              <div className="review-text">"{review.text}"</div>
              {review.comments.length > 0 && (
                <div className="review-comments">
                  {review.comments.map(comment => (
                    <div key={comment.id} className="review-comment">
                      <span>{comment.author}: {comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="review-actions">
                <button
                  onClick={() => handleAddReviewComment(review.id)}
                  className="btn btn-small"
                >
                  添加意见
                </button>
                {review.status === 'pending' && (
                  <button
                    onClick={() => handleResolveReview(review.id)}
                    className="btn btn-small"
                  >
                    标记已解决
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Editor
