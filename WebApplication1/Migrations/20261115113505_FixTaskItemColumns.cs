using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class FixTaskItemColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "TaskItem",
                type: "date",
                nullable: true);

            migrationBuilder.Sql(
                "UPDATE \"TaskItem\" SET \"StartDate\" = \"CreatedAt\";");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "StartDate",
                table: "TaskItem",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.Sql(
                "ALTER TABLE \"TaskItem\" ALTER COLUMN \"CreatedAt\" TYPE timestamp with time zone " +
                "USING (\"CreatedAt\"::timestamp without time zone AT TIME ZONE 'UTC');");

            migrationBuilder.AddColumn<int>(
                name: "CreatedId",
                table: "TaskItem",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DelFlag",
                table: "TaskItem",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TaskItem",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedId",
                table: "TaskItem",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "TaskItem");

            migrationBuilder.DropColumn(
                name: "DelFlag",
                table: "TaskItem");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TaskItem");

            migrationBuilder.DropColumn(
                name: "UpdatedId",
                table: "TaskItem");

            migrationBuilder.Sql(
                "UPDATE \"TaskItem\" SET \"CreatedAt\" = " +
                "(\"StartDate\"::timestamp without time zone AT TIME ZONE 'UTC');");

            migrationBuilder.Sql(
                "ALTER TABLE \"TaskItem\" ALTER COLUMN \"CreatedAt\" TYPE date " +
                "USING (\"CreatedAt\" AT TIME ZONE 'UTC')::date;");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "TaskItem");
        }
    }
}
