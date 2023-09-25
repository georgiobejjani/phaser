class CustomButton extends Phaser.GameObjects.Container {
	constructor(
		scene,
		x,
		y,
		image1,
		image2,
		image3,
		action,
		width,
		height,
		type,
		text,
		id
	) {
		super(scene, x, y);

		let textStyle = {
			fontSize: "16px",
			fill: "#ffff",
			fontFamily: "Inter",
		};

		const buttonClick = scene.sound.add("buttonClick", { loop: false });

		const menuItem = scene.add.image(x, y, image1);
		menuItem.setDisplaySize(width, height);
		menuItem.setInteractive();
		menuItem.setDepth(1);

		let buttonText = scene.add.text(x, y, text, textStyle);
		buttonText.setOrigin(0.5);
		buttonText.setDepth(2);

		menuItem.on("pointerover", () => {
			scene.input.setDefaultCursor("pointer");
			if (type === "button") {
				this.menuItem2Texture = image2;
				menuItem.setTexture(this.menuItem2Texture);
				buttonText.setColor("#CE441A");
			}
		});

		menuItem.on("pointerout", () => {
			scene.input.setDefaultCursor("auto");
			if (type === "button") {
				this.menuItem2Texture = image1;
				menuItem.setTexture(this.menuItem2Texture);
				buttonText.setColor("#ffffff");
			}
		});

		menuItem.on("pointerdown", function () {
			if (image3 !== "none") {
				this.menuItem2Texture =
					this.menuItem2Texture === image1 ? image3 : image1;
				menuItem.setTexture(this.menuItem2Texture);
			}
			buttonClick.play();
			action();
		});

		this.disable = function () {
			menuItem.disableInteractive();
		};
		this.enable = function () {
			menuItem.setInteractive();
		};
	}
}

export default CustomButton;
