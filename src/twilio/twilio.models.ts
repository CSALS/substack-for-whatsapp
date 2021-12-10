export interface UserModel {
    ProfileName: string;
    WaId: string;
    Body: string;
    NumMedia: number;
    MediaUrl0: string;
}

export const getPhoneNumber = (userModel: UserModel): number => {
    return parseInt(userModel.WaId.substring(userModel.WaId.length - 10), 10) as number;
}