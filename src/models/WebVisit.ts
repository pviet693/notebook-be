import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@/configs/database.config";

interface WebVisitAttributes {
    date: string;
    visitCount: number;
}

type WebVisitCreationAttributes = Optional<WebVisitAttributes, "visitCount">;

class WebVisit extends Model<WebVisitAttributes, WebVisitCreationAttributes> implements WebVisitAttributes {
    public date!: string;
    public visitCount!: number;
}

WebVisit.init(
    {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            primaryKey: true
        },
        visitCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: "web_visit",
        modelName: "WebVisit",
        timestamps: false
    }
);

export default WebVisit;
