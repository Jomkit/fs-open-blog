const { DataTypes } = require('sequelize');

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year_written', {
            type: DataTypes.INTEGER,
            defaultValue: new Date().getFullYear(),
            validate: {
                isInt: true,
                min: 1900, // Assuming blogs are not written before 1900
                max: new Date().getFullYear() // No future dates
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('blogs', 'year_written');
    }
}