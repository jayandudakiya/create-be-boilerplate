import User from '../models/user.model.js';
import { hashPassword } from '../utils/hash.js';

class UserService {
  // Create a new user
  async createUser({ newUserData }) {
    const hashedPassword = await hashPassword({ value: newUserData.password });
    const user = await User.create({
      ...newUserData,
      password: hashedPassword,
    });

    return user || null;
  }

  // Find a single user
  async findUser({ filter = {}, projection = '' }) {
    const user = await User.findOne(filter).select(projection);
    return user || null;
  }

  // Update user by ID
  async updateUser({ id, updateBody = {} }) {
    const updatedUser = await User.findByIdAndUpdate(id, updateBody, {
      new: true,
    }).select('-password');

    return updatedUser || null;
  }

  // Get all users with optional filters, projections, and pagination
  async getAllUsers({ filter = {}, options = {}, projection = '' }) {
    const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;

    const totalCount = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select(projection)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const warning =
      limit > totalCount
        ? `Only ${totalCount} users found, but you requested ${limit}. Showing available users.`
        : null;

    return {
      data: users,
      total: users.length,
      warning,
    };
  }

  // Delete user by ID
  async deleteUser({ id }) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error('User not found for deletion');
    }
    return deletedUser;
  }
}

export default UserService;
export const userServiceInstance = new UserService();
