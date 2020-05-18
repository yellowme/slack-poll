module.exports = {
  up: async (queryInterface, Sequelize) => {
    const memo = {};
    const { sequelize } = queryInterface;

    const [, pollRecords] = await sequelize.query("select * from polls");
    const [, pollAnswerRecords] = await sequelize.query(
      "select * from poll_answers"
    );

    const polls = pollRecords.rows.map((row) => {
      // eslint-disable-next-line prefer-const
      let [question = "", ...options] = row.text
        .replace(/\u201D/g, '"')
        .replace(/\u201C/g, '"')
        .split('" "');

      let lastOption = options.pop() || "";

      question = question.replace(/"/g, "");
      lastOption = lastOption.replace(/"/g, "");
      options.push(lastOption);

      const poll = {
        question,
        options,
        owner: row.owner || "",
        timestamp: row.titleTs,
        mode: row.mode,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };

      // Made easy to fine in answer relation
      memo[row.id] = poll.id;

      return poll;
    });

    const pollAnswers = pollAnswerRecords.rows.map((row) => {
      return {
        option: row.answer,
        owner: row.userId,
        pollId: memo[row.pollId],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });

    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.dropTable("poll_answers", { transaction });
        await queryInterface.dropTable("polls", { transaction });

        await queryInterface.createTable(
          "polls",
          {
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
              primaryKey: true,
            },
            question: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            options: {
              type: Sequelize.ARRAY(Sequelize.TEXT),
              allowNull: false,
            },
            owner: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            timestamp: {
              type: Sequelize.STRING,
            },
            mode: {
              type: Sequelize.ENUM("s", "m"),
              defaultValue: "s",
            },
            createdAt: {
              type: "TIMESTAMP",
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
              allowNull: false,
            },
            updatedAt: {
              type: "TIMESTAMP",
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
              allowNull: false,
            },
          },
          {
            transaction,
          }
        );

        await queryInterface.createTable(
          "poll_answers",
          {
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
              primaryKey: true,
            },
            option: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            owner: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            createdAt: {
              type: "TIMESTAMP",
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
              allowNull: false,
            },
            updatedAt: {
              type: "TIMESTAMP",
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
              allowNull: false,
            },
            pollId: {
              type: Sequelize.UUID,
              references: {
                model: "polls",
                key: "id",
              },
              onUpdate: "CASCADE",
              onDelete: "SET NULL",
            },
          },
          {
            transaction,
          }
        );

        await queryInterface.bulkInsert("polls", polls, { transaction });
        await queryInterface.bulkInsert("poll_answers", pollAnswers, {
          transaction,
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    });
  },

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
