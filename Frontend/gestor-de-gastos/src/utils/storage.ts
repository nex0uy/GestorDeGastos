export interface UserData {
    userId: number;
    token: string;
    userName: string;
  }
  
  export const setUserData = (data: UserData) => {
    localStorage.setItem('userData', JSON.stringify(data));
  };
  
  export const getUserData = (): UserData | null => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  };
  
  export const clearUserData = () => {
    localStorage.removeItem('userData');
  };
  
  