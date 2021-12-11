export interface TwilioUserModel {
    ProfileName: string;
    WaId: string;
    Body: string;
    NumMedia: number;
    MediaUrl0: string;
}

export const getPhoneNumber = (userModel: TwilioUserModel): number => {
    return parseInt(userModel.WaId.substring(userModel.WaId.length - 10), 10) as number;
}