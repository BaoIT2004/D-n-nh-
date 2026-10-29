using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class fixdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_addStatusTasks_Projects_ProjectId",
                table: "addStatusTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_addStatusTasks",
                table: "addStatusTasks");

            migrationBuilder.RenameTable(
                name: "addStatusTasks",
                newName: "AddStatusTasks");

            migrationBuilder.RenameIndex(
                name: "IX_addStatusTasks_ProjectId",
                table: "AddStatusTasks",
                newName: "IX_AddStatusTasks_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AddStatusTasks",
                table: "AddStatusTasks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AddStatusTasks_Projects_ProjectId",
                table: "AddStatusTasks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AddStatusTasks_Projects_ProjectId",
                table: "AddStatusTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AddStatusTasks",
                table: "AddStatusTasks");

            migrationBuilder.RenameTable(
                name: "AddStatusTasks",
                newName: "addStatusTasks");

            migrationBuilder.RenameIndex(
                name: "IX_AddStatusTasks_ProjectId",
                table: "addStatusTasks",
                newName: "IX_addStatusTasks_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_addStatusTasks",
                table: "addStatusTasks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_addStatusTasks_Projects_ProjectId",
                table: "addStatusTasks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
