import User from "./user.model.js"


class UserRepository {
    /**
   * Create a new user
   * @param {Object} data
   * @param {Object|null} session
   * @returns {Promise<Object>}
   */
    async createUser(data, session = null) {
        const options = session ? { session } : {}
        const [user] = await User.create([data], options)
        return user
    }

    /**
   * Find user by ID
   * @param {String} id
   * @param {String} selectFields
   * @returns {Promise<Object|null>}
   */
    async findUserById(id, selectFields = '') {
        return User.findById(id).select(selectFields)
    }

    /**
   * Find one user by query
   * @param {Object} query
   * @param {String} selectFields
   * @returns {Promise<Object|null>}
   */
    async findOne(query, selectFields = '') {
        return User.findOne(query).select(selectFields)
    }



    /**
   * Find multiple users
   * @param {Object} query
   * @param {Object} options
   * @returns {Promise<Array>}
   */
    async findMany(query = {}, options = {}) {
        const {
            selectFields = '',
            sort = '-createdAt',
            skip = 0,
            limit = 10,
            lean = true
        } = options

        let dbQuery = User.find(query)
            .select(selectFields)
            .sort(sort)
            .skip(skip)
            .limit(limit)

        if (lean) dbQuery = dbQuery.lean()

        return dbQuery
    }

    /**
   * Update user by ID
   * @param {String} id
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise<Object|null>}
   */
    async updateById(id, data, options = {}) {

        return User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            ...options
        })
    }

    /**
   * Update one user by query
   * @param {Object} query
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise<Object|null>}
   */
    async updateOne(query, data, options = {}) {

        return User.findOneAndUpdate(query, data, {
            new: true,
            runValidators: true,
            ...options
        })
    }

    /**
   * Delete user by ID
   * @param {String} id
   * @returns {Promise<Object|null>}
   */
    async deleteById(id) {
        return User.findByIdAndDelete(id)
    }

    /**
   * Count users
   * @param {Object} query
   * @returns {Promise<Number>}
   */
    async count(query = {}) {
        return User.countDocuments(query);
    }

    /**
   * Paginate users
   * @param {Object} query
   * @param {Object} options
   * @returns {Promise<Object>}
   */
    async paginate(query = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            selectFields = '',
            lean = true
        } = options

        const skip = (page - 1) * limit

        let usersQuery = User.find(query)
            .select(selectFields)
            .sort(sort)
            .skip(skip)
            .limit(limit)

        if (lean) usersQuery = usersQuery.lean()

        const [data, total] = await Promise.all([
            usersQuery,
            User.countDocuments(query)
        ])

        return {
            data,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            limit: Number(limit)
        }
    }
}

const userRepository = new UserRepository()

export default userRepository