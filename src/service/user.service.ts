import { UpdateProfileDto } from "../dto/update-profile.dto.js";
import { Profile } from "../entity/Profile.js";
import { profileRepository } from "../repository/profile.repository.js";
import { userRepository } from "../repository/user.repository.js";
import { CustomThrowError } from "../types/CustomThrowError.js";
import { TokenPayload } from "../types/TokenPayload.js";
import { TokenType } from "../types/TokenType.js";
import { verifyToken } from "../utils/jwt.util.js";

type GetUserSource = 'ID' | 'ACCESS_TOKEN' | 'REFRESH_TOKEN';
export class UserService {
    // User service methods would be defined here
    async getProfile(userId: number) {
        const user = await userRepository.findOne({
            where: { id: userId },
            select: ["id", "username", "email", "isEmailVerified", "isDisabled", "accountNonExpired", "credentialsNonExpired", "accountNonLocked", "createdAt", "updatedAt", "profile", "role"], // Select only necessary fields
        });
        if (!user) {
            return null; // ko throw vì hàm này được gọi như 1 giá trị trả về, ko phải xử lý lỗi.
        }
        return user;
    }

    async getUserFrom(from: GetUserSource, value: string | number, ) {
        let userId: number;
        switch (from) {
            case 'ACCESS_TOKEN': {
                const payload = verifyToken(value as string, TokenType.ACCESS) as TokenPayload;
                userId = payload.userId;
                break;
            }
            case 'REFRESH_TOKEN': {
                const payload = verifyToken(value as string, TokenType.REFRESH) as TokenPayload;
                userId = payload.userId;
                break;
            }
            case 'ID': {
                userId = value as number;
                break;
            }
            default:
                throw new Error("Invalid source type");
        }
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User id ${userId} not found`);
        }
        return user;
    }

    async updateProfile(profileId: number, dto: UpdateProfileDto): Promise<Profile> {
        const profile = await profileRepository.findOne({ where: { id: profileId }});
        if(!profile) {
            throw new CustomThrowError("UPDATE_PROFILE", "Profile not found", 404);
        }
        Object.assign(profile, dto);
        profile.updatedAt = new Date().toISOString();
        return profileRepository.save(profile);
    }
}