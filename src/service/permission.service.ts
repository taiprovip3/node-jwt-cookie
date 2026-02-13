import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";

export class PermissionService {
  async getUserPermissions(userId: number): Promise<Set<string>> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: {
        permissions: true,
        role: { permissions: true },
      }
    });
    if (!user) {
      return new Set();
    }
    const permissions = new Set<string>();
    const rolePermissions = await user.role.permissions;
    rolePermissions.forEach(p => permissions.add(p.code));
    user.permissions.forEach(p => permissions.add(p.code));
    return permissions;
  }

  async hasPermission(userId: number, permissionCode: string): Promise<boolean> {
    const perms = await this.getUserPermissions(userId);
    return perms.has(permissionCode);
  }
}