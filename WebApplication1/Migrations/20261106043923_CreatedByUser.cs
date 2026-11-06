using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class CreatedByUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "TaskItem",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskItem_CreatedByUserId",
                table: "TaskItem",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Users_CreatedByUserId",
                table: "TaskItem",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Users_CreatedByUserId",
                table: "TaskItem");

            migrationBuilder.DropIndex(
                name: "IX_TaskItem_CreatedByUserId",
                table: "TaskItem");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "TaskItem");
        }
    }
}
