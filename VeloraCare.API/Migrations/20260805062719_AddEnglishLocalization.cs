using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VeloraCare.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEnglishLocalization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BadgeEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BenefitsEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HowToUseEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IngredientsEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SkinTypeEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaglineEn",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("UPDATE HeroSlides SET Rating = '5.0' WHERE ISNUMERIC(Rating) = 0;");

            migrationBuilder.AlterColumn<double>(
                name: "Rating",
                table: "HeroSlides",
                type: "float",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "BadgeEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MiniCardOfferEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MiniCardTitleEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductSubEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductTitleEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TitleHighlightEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TitleRestEn",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BadgeEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "BenefitsEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "HowToUseEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IngredientsEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SkinTypeEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TaglineEn",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "BadgeEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "MiniCardOfferEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "MiniCardTitleEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "ProductSubEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "ProductTitleEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "TitleHighlightEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "TitleRestEn",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "Categories");

            migrationBuilder.AlterColumn<string>(
                name: "Rating",
                table: "HeroSlides",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");
        }
    }
}
