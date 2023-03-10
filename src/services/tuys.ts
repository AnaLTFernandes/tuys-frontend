import {
	ChannelType,
	CommentType,
	MyDataType,
	NotificationType,
	StoryType,
	UserDataType,
	UserRegisterType,
	UsersType,
	UserType,
} from "../components/utils/Protocols";

const BASE_URI = process.env.REACT_APP_API_URI;

function createHeader() {
	const token = JSON.parse(localStorage.getItem("tuys.com") || "{}")?.token;

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};

	return config;
}

async function throwError(response: Response) {
	const error = await response
		.json()
		.then((response) => response)
		.catch((error) => "{ message: 'Um erro ocorreu' }");

	const errorString = JSON.stringify({
		message: error,
		status: response.status,
	});

	throw new Error(errorString);
}

async function getRequest<Type>(path: string) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<Type>;
}

async function postRequest<Type>(
	path: string,
	body: any,
	haveResponse = false
) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	if (!haveResponse) return;

	return response.json() as Promise<Type>;
}

async function deleteRequest<Type>(path: string, haveResponse = false) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "DELETE",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	if (!haveResponse) return;

	return response.json() as Promise<Type>;
}

async function putRequest<Type>(path: string, body: any, haveResponse = false) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "PUT",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	if (!haveResponse) return;

	return response.json() as Promise<Type>;
}

const getChannels = () => {
	return getRequest<ChannelType[]>("/channels");
};

const getStories = () => {
	return getRequest<StoryType[]>("/stories");
};

const getStoriesFromChannel = (channelId: number) => {
	return getRequest<StoryType[]>(`/stories/${channelId}`);
};

const getComments = (storyId: number) => {
	return getRequest<CommentType[]>(`/stories/${storyId}/comments`);
};

const getMyData = () => {
	return getRequest<MyDataType>(`/users/me`);
};

const getRegister = () => {
	return getRequest<UserRegisterType>(`/users/register/me`);
};

const getMyStories = () => {
	return getRequest<StoryType[]>(`/users/me/stories`);
};

const getUserStories = (userId: number) => {
	return getRequest<StoryType[]>(`/users/${userId}/stories`);
};

const getUsers = (usename: string) => {
	return getRequest<UsersType[]>(`/users/${usename}`);
};

const getUserData = (userId: number) => {
	return getRequest<UserDataType>(`/users/user/${userId}`);
};

const getRanking = () => {
	return getRequest<StoryType[]>(`/ranking`);
};

const getNotifications = () => {
	return getRequest<NotificationType[]>(`/notifications`);
};

const postStory = (body: PostStoryParams) => {
	return postRequest(`/stories`, body);
};

const postLike = (storyId: number) => {
	return postRequest(`/stories/${storyId}/like`, {});
};

const postUnlike = (storyId: number) => {
	return postRequest(`/stories/${storyId}/unlike`, {});
};

const postComment = (data: PostCommentParams) => {
	return postRequest(`/stories/${data.storyId}/comments`, data.body);
};

const postDenounce = (data: PostDenounceParams) => {
	return postRequest(`/stories/${data.storyId}/denounce`, data.body);
};

const postFollow = (userId: number) => {
	return postRequest(`/users/${userId}/follow`, {});
};

const postUnfollow = (userId: number) => {
	return postRequest(`/users/${userId}/unfollow`, {});
};

const postNotificationRead = (id: number) => {
	return postRequest(`/notifications/${id}/read`, {});
};

const postSignUp = (body: PostSignUpParams) => {
	return postRequest(`/auth/sign-up`, body);
};

const postSignIn = (body: PostSignInParams) => {
	return postRequest<UserType>(`/auth/sign-in`, body, true);
};

const postSignOut = () => {
	return postRequest(`/auth/sign-out`, {});
};

const postSignWithGoogle = (body: PostSignUpParams) => {
	return postRequest<UserType>(`/auth/sign/method/google`, body, true);
};

const deleteStory = (storyId: number) => {
	return deleteRequest(`/stories/${storyId}`);
};

const putStory = (body: PutStoryParams, storyId: number) => {
	return putRequest(`/stories/${storyId}`, body);
};

const putRegister = (body: PutRegisterParams, userId: number) => {
	return putRequest(`/users/${userId}`, body);
};

export type PostStoryParams = {
	title: string;
	body: string;
	channelId: number;
};
export type PostCommentParams = {
	body: { text: string };
	storyId: number;
};
export type PostSignUpParams = Omit<UserRegisterType, "id" | "about"> & {
	password: string;
};
export type PostSignInParams = Omit<PostSignUpParams, "username" | "avatar">;
export type PostDenounceParams = PostCommentParams;
export type PutStoryParams = Omit<PostStoryParams, "channelId">;
export type PutRegisterParams = Omit<UserRegisterType, "id" | "email">;

const getFunctions = {
	getChannels,
	getStories,
	getStoriesFromChannel,
	getComments,
	getMyData,
	getMyStories,
	getUsers,
	getUserData,
	getRegister,
	getUserStories,
	getRanking,
	getNotifications,
};

const postFunctions = {
	postStory,
	postLike,
	postUnlike,
	postComment,
	postDenounce,
	postFollow,
	postUnfollow,
	postNotificationRead,
	postSignUp,
	postSignIn,
	postSignOut,
	postSignWithGoogle,
};

const deleteFunctions = {
	deleteStory,
};

const putFunctions = {
	putStory,
	putRegister,
};

const service = {
	...getFunctions,
	...postFunctions,
	...deleteFunctions,
	...putFunctions,
};

export default service;
