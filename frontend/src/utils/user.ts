import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'collaborative-editor-user-id';
const USER_NAME_KEY = 'collaborative-editor-user-name';

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
];

export const userManager = {
  getCurrentUser() {
    let userId = localStorage.getItem(USER_ID_KEY);
    let userName = localStorage.getItem(USER_NAME_KEY);

    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(USER_ID_KEY, userId);
    }

    if (!userName) {
      userName = `用户${userId.slice(0, 6)}`;
      localStorage.setItem(USER_NAME_KEY, userName);
    }

    // 根据用户ID生成颜色
    const colorIndex = parseInt(userId.slice(0, 2), 16) % colors.length;
    const color = colors[colorIndex];

    return {
      id: userId,
      name: userName,
      color,
    };
  },
};

