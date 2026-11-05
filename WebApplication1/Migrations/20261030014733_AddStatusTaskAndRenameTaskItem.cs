using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusTaskAndRenameTaskItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Projects_ProjectId",
                table: "TaskItem");

            migrationBuilder.RenameColumn(
                name: "ProjectId",
                table: "TaskItem",
                newName: "StatusId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItem_ProjectId",
                table: "TaskItem",
                newName: "IX_TaskItem_StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_AddStatusTasks_StatusId",
                table: "TaskItem",
                column: "StatusId",
                principalTable: "AddStatusTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_AddStatusTasks_StatusId",
                table: "TaskItem");

            migrationBuilder.RenameColumn(
                name: "StatusId",
                table: "TaskItem",
                newName: "ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItem_StatusId",
                table: "TaskItem",
                newName: "IX_TaskItem_ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Projects_ProjectId",
                table: "TaskItem",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
