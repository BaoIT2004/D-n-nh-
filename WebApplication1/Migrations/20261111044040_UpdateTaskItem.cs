using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTaskItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssigneeId",
                table: "TaskItem",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "TaskItem",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskItem_AssigneeId",
                table: "TaskItem",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskItem_ParentId",
                table: "TaskItem",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_TaskItem_ParentId",
                table: "TaskItem",
                column: "ParentId",
                principalTable: "TaskItem",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Users_AssigneeId",
                table: "TaskItem",
                column: "AssigneeId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_TaskItem_ParentId",
                table: "TaskItem");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Users_AssigneeId",
                table: "TaskItem");

            migrationBuilder.DropIndex(
                name: "IX_TaskItem_AssigneeId",
                table: "TaskItem");

            migrationBuilder.DropIndex(
                name: "IX_TaskItem_ParentId",
                table: "TaskItem");

            migrationBuilder.DropColumn(
                name: "AssigneeId",
                table: "TaskItem");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "TaskItem");
        }
    }
}
