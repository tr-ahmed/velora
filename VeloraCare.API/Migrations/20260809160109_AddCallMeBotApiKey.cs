using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VeloraCare.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCallMeBotApiKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CallMeBotApiKey",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CallMeBotApiKey",
                table: "StoreSettings");
        }
    }
}
