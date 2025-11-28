import { userRepository } from "../repository/user.repository.js";

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
}