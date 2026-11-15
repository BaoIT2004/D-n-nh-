using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusTaskTableBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AddStatusTasks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedId",
                table: "AddStatusTasks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DelFlag",
                table: "AddStatusTasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "AddStatusTasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedId",
                table: "AddStatusTasks",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AddStatusTasks");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "AddStatusTasks");

            migrationBuilder.DropColumn(
                name: "DelFlag",
                table: "AddStatusTasks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "AddStatusTasks");

            migrationBuilder.DropColumn(
                name: "UpdatedId",
                table: "AddStatusTasks");
        }
    }
}
