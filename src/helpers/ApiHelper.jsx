import axios from 'axios';
import LocalStorage from './LocalStorage';

class ApiHelper {

    static getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    static fetchCsrfToken = async () => {
        try {
            await axios.get('/api/csrf-cookie', { withCredentials: true });
            const csrfToken = this.getCookie('XSRF-TOKEN');
            return csrfToken;
        } catch (error) {
            console.error('Error retrieving CSRF cookie:', error);
            throw error;
        }
    };

    static fetchPosts = async (page = 1, per_page = 15, paginate = true, search = '', sort = '-created_at', user_uuid = '', withAuthor = true, withCommentCount = false) => {
        try {
            const response = await axios.get('/api/posts', { 
                withCredentials: true,
                params: {
                    page,
                    per_page,
                    paginate,
                    'filter[search]': search,
                    sort,
                    'filter[user_uuid]': user_uuid,
                    withAuthor,
                    withCommentCount
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching post data:', error);
            throw error;
        }
    }

    static fetchPost = async (uuid) => {
        try {
            const response = await axios.get(`/api/posts/${uuid}`, { withCredentials: true });
            console.log(response.data.data)
            return response.data.data;
        } catch (error) {
            console.error('Error fetching friend data:', error);
            throw error;
        }
    }

    static fetchUserWithoutFriends = async () => {
        try {
            const response = await axios.get('/api/users?filter[search_not_friend]=j&paginate=false', { withCredentials: true });
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching users data:', error);
            throw error;
        }
    }

    static fetchLoggedUserWithFriends = async () => {
        try {
            const response = await axios.get('/api/user?withFriends=true', { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };

    static fetchFriendData = async (uuid) => {
        try {
            const response = await axios.get(`/api/users/${uuid}`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching friend data:', error);
            throw error;
        }
    }

    static fetchLoggedUser = async () => {
        try {
            const response = await axios.get('/api/user', { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    static addFriend = async (friend_uuid) => {
        try {
            const uuid = LocalStorage.GetActiveUser();
            const response = await axios.post(`/api/users/${uuid}/addFriend`, {
                friend_uuid: friend_uuid
            }, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error adding friend:', error);
            throw error;
        }
    }

    static createGame = async (player_limit, level) => {
        try {
            const response = await axios.post('/api/games', {
                limit: player_limit,
                level: level,
            }, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error creating lobby:', error);
            throw error;
        }
    }

    static addUserToLobby = async (gameUUID, joiner_uuid) => {
        try {
            const response = await axios.put(`/api/games/${gameUUID}`, {
                joiner_uuid: joiner_uuid,
            }, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error when adding player to lobby:', error);
            throw error;
        }
    }

    static fetchUserByUUID = async (userUUID) => {
        try {
            const response = await axios.get(`/api/users/${userUUID}`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error(`Error when fetching ${userUUID} user data:`, error);
            throw error;
        }
    }

    static updateLobbyStage = async (gameUUID, stage) => {
        try {
            const response = await axios.put(`/api/games/${gameUUID}`, {
                stage: stage,
            }, {
                withCredentials: true
            });
            return response;
        } catch (error) {
            console.error('Error when updating lobby stage:', error);
            throw error;
        }
    }

    static updateLobbyPoints = async (gameUUID, points) => {
        try {
            const response = await axios.put(`/api/games/${gameUUID}`, {
                points: points,
            }, {
                withCredentials: true
            });
            return response;
        } catch (error) {
            console.error('Error when updating lobby points:', error);
            throw error;
        }
    }

    static destroyGame = async (gameUUID) => {
        try {
            const response = await axios.delete(`/api/games/${gameUUID}`, {
                withCredentials: true
            });
            return response;
        } catch (error) {
            console.error('Error when destroying game lobby:', error);
            throw error;
        }
    }
}

export default ApiHelper;
