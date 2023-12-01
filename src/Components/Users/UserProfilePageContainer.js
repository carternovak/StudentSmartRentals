import styled from "styled-components";
import { Link } from "react-router-dom";

export const UserProfilePageContainer = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;
export const UserProfileNavigationBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  width: 500px;
  background-color: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #ccc;
`;
export const UserProfileNavigationLink = styled(Link)`
  text-decoration: none;
  text-align: center;
  color: #333;
  margin: 0 20px;
  padding: 10px;
  width: 33%;
  font-size: 18px;
  &:hover {
    color: #ff0000;
  }
`;
export const UserProfileCard = styled.div`
  width: 500px;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
export const UserProfileTitle = styled.h1`
  text-align: center;
  color: #333;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
`;
export const UserProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
export const UserProfileInfoLabel = styled.label`
  font-weight: bold;
  color: #666;
  font-size: 16px;
  margin-bottom: 5px;
`;
export const UserProfileInfoValue = styled.div`
  font-size: 18px;
  color: #333;
`;
export const UserProfileButton = styled.button`
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #cc0000;
  }
`;
const UserProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  color: #000000;
`;
export const UserProfileInput = styled.input`
  border: none;
  border-bottom: 1px solid #000;
  background-color: transparent;
  font-size: 16px;
`;
export const UserProfileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;
export const UserProfileListItem = styled.li`
  margin-bottom: 10px;
  color: #000000;
`;
