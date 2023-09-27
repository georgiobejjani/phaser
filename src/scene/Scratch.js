import BaseScene from "./BaseScene";
import CustomButton from "./CustomButton";
import axios from "axios";
const COVER_TEXTURE = "ball_gratage";
const EMITTER = "emitter";
const UNSCRATCHED = "UnscratchedBg";

export default class Scratch extends BaseScene {
	constructor(config) {
		super("Scratch", { ...config });
		this.config = config;
		this.isDown = false;
		this.renderTexture = null;
		this.brush = null;
		this.erasedPixels = 0;
		this.screenCenter = [config.width / 2, config.height / 2];
		this.isPointerDown = false;
		this.isClicking = false;
		this.ticketCount = 0;
		this.ticketToPlay = 0;
		this.canvasCollection = [];
		this.isScratched = false;
		this.counter = 0;
		this.array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.winning = Math.random() < 0.5;
		this.score = 100;
		this.initialScore = 0;
		this.animalTicketCnt = null;
		this.targetScore = 150;
		this.animationDuration = 2000;
		this.currentScore = this.initialScore;
		const urlParams = new URLSearchParams(window.location.search);

		this.token = urlParams.get("token");
		this.state = {
			targetScore:0,
			myArray: [],
			ticketId: null,
			winningValue: "",
			availableTickets: 0,
			ticketsInfo: [],
		};
	}

	create() {
		super.create();
		this.createTexture();
		this.scratchOff();
		this.Buybuttons();
		this.initializeContainer();
		this.createAnimalBoard();

		this.buttonClick = this.sound.add("buttonClick", { loop: false });
		this.winningsound = this.sound.add("winning-sound", { loop: false });
		this.loosingsound = this.sound.add("loosing-sound", { loop: false });

		this.events.on("openInfo", () => {
			this.overlayContainer.setVisible(true);
			this.InfoContainer.setVisible(true);
			this.overlayContainerTckts.setVisible(false);
			this.TcktsContainer.setVisible(false);
		});

		this.events.on("opentckts", () => {
			if(this.state.ticketsInfo==[]) {
				this.getInfos();
			}
			this.overlayContainer.setVisible(false);
			this.InfoContainer.setVisible(false);
			this.overlayContainerTckts.setVisible(true);
			this.TcktsContainer.setVisible(true);
		});


		this.add.image(1100, 80, "ticketPrice").setScale(0.3);
		this.add.image(this.screenCenter[0], this.screenCenter[1], UNSCRATCHED).setScale(1.1);

		this.playbtnsContainer = this.add.container(...this.screenCenter);

		this.playAgain = new CustomButton(
			this,
			this.screenCenter[0] - 150,
			this.screenCenter[1] + 330,
			"greyBtn",
			"yellowBtn",
			"none",
			() => this.playAgainFct(),
			200,
			40,
			"button",
			"R E J O U E R"
		);

		this.scratchAllBtn = new CustomButton(
			this,
			this.screenCenter[0] + 150,
			this.screenCenter[1] + 330,
			"yellowBtn",
			"whiteBtn",
			"none",
			this.handleScratch.bind(this),
			200,
			40,
			"button",
			"G R A T T E R   T O U T",
			2
		);

		this.playbtnsContainer.add([this.playAgain, this.scratchAllBtn]);

		this.resultContainer = this.add.container(...this.screenCenter).setDepth(4);
		this.resultContainer.setAlpha(0);
		this.resultContainerLoosing = this.add
			.container(...this.screenCenter)
			.setDepth(4);
		this.resultContainerLoosing.setAlpha(0);

		this.textloosing = this.add
			.text(0, -10, "OOPS, \nRéessayer!", {
				fontSize: "40px",
				fill: "#fff",
				fontFamily: "Black Ops One",
				shadow: {
					offsetX: 2,
					offsetY: 2,
					color: "#000",
					stroke: true,
					fill: true,
				},
				align: "center",
			})
			.setOrigin(0.5);

		this.text = this.add
			.text(0, -40, `GAIN \n${this.currentScore}`, {
				fontSize: "40px",
				fill: "#fff",
				fontFamily: "Black Ops One",
				shadow: {
					offsetX: 2,
					offsetY: 2,
					color: "#000",
					stroke: true,
					fill: true,
				},
				align: "center",
			})
			.setOrigin(0.5);

		this.resultContainer.add([this.text]);
		this.resultContainerLoosing.add(this.textloosing);
		this.getTicket()
			.then(() => {
				this.createRandomAnimal(this.state.myArray);
			})
			.catch((error) => {
				console.error("Error", error);
			});

		this.getInfos()
			.then(() => {
				this.createScrollContainer(this.state.ticketsInfo);
			})
			.catch((error) => {
				console.error("Error", error);
			});
	}

	LoaderAnimation(x, y) {
		this.spinner = this.add.sprite(
			x,
			y,
			"loadingWheel"
		);
		this.spinner.setScale(0.7);
		this.spinner.setDepth(2);
		this.tweens.add({
			targets: this.spinner,
			rotation: Math.PI * 2,
			duration: 1000,
			repeat: -1,
		});
	}

	createScrollContainer(values) {
		this.overlayContainerTckts = this.add.container(0, 0).setDepth(10);
		this.TcktsContainer = this.add
			.container(this.screenCenter[0] - 210, this.screenCenter[1] - 145)
			.setDepth(11);

		const closeButton = this.add
			.text(550, -50, "X", {
				fontFamily: "Black Ops One",
				fontSize: "32px",
				fill: "#000",
			})
			.setDepth(2)
			.setOrigin(1);
		closeButton.setInteractive();

		closeButton.on("pointerdown", () => {
			this.overlayContainerTckts.setVisible(false);
			this.TcktsContainer.setVisible(false);
			this.buttonClick.play();
		});

		closeButton.on("pointerover", () => {
			this.input.setDefaultCursor("pointer");
		});

		const board_info = this.add
			.image(this.screenCenter[0], this.screenCenter[1], "info-board")
			.setDisplaySize(800, 500);

		this.overlayContainerTckts.add(board_info, this.InfoContainer);
		this.overlayContainerTckts.setVisible(false);
		this.TcktsContainer.setVisible(false);
		this.TcktsContainer.add(closeButton);
		const title = ['id','Date','Status','Prix','Gains']
		this.title = this.add.text(
			-60,
			-50,
			`${title[0].padEnd(10,' ')+'     		'}${title[1].padStart(10,' ')+'     	'}${title[2].padStart(10,' ')+'     		'}${title[3].padStart(10,' ')+'     		'}${title[4].padStart(10,' ')+'     '}`,
			{ color: "#000000", fontFamily: "Inter", fontSize: "20px" }
		)
		const scrollContainer = this.add.container(-100, 0);
		const containerWidth = 1100;
		const containerHeight = 350;
		const mask = this.make.graphics();
		mask.fillStyle(0x000);
		mask.fillRect(0, 250, containerWidth, containerHeight);

		scrollContainer.setInteractive(
			new Phaser.Geom.Rectangle(0, 0, containerWidth, containerHeight),
			Phaser.Geom.Rectangle.Contains
		);

		var i = 0;
		values.map((itemss) => {
			const id = `${itemss.id}`;
			const purchaseDate = new Date(itemss.purchaseDate).toISOString().split('T')[0];
			const status = `${itemss.status}`;
			const price = `${itemss.price}`;
			const prize = `${itemss.prize}`;
		
			// Find the maximum width among the values
			const maxWidth = Math.max(id.length, purchaseDate.length, status.length, price.length, prize.length);
			// Pad the values with spaces to match= the maximum width
			const formattedId = id.padEnd(maxWidth , ' ');
			const formattedPurchaseDate = purchaseDate.padStart(maxWidth, ' ');
			const formattedStatus = status.padStart(maxWidth, ' ');
			const formattedPrice = price.padStart(maxWidth, ' ');
			const formattedPrize = prize.padStart(maxWidth, ' ');
			const text = this.add.text(
				10,
				i * 30,
				`${formattedId+'     		'}${formattedPurchaseDate+'	'}${formattedStatus+'     '}${formattedPrice+'     		'}${formattedPrize}`,
				{ color: "#000000", fontFamily: "Inter", fontSize: "20px" }
			);
		
			scrollContainer.add(text);
			i++;
		});

		scrollContainer.mask = new Phaser.Display.Masks.GeometryMask(this, mask);

		this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
			scrollContainer.y += deltaY * 0.5;
			scrollContainer.y = Phaser.Math.Clamp(scrollContainer.y, -values.length * 30 + 30, 0); // Adjust the scroll speed as needed
		});

		let isScrolling = false;
		let startY = 0;

		this.input.on("pointerdown", (pointer) => {
			isScrolling = true;
			startY = pointer.y;
		});

		this.input.on("pointermove", (pointer) => {
			if (isScrolling) {
				const deltaY = pointer.y - startY;
				scrollContainer.y += deltaY * 0.5; 
				startY = pointer.y;

				scrollContainer.y = Phaser.Math.Clamp(
					scrollContainer.y,
					-values.length * 30 + 30,
					0
				); 
			}
		});

		// Listen for pointer up event
		this.input.on("pointerup", () => {
			isScrolling = false;
		});


		this.TcktsContainer.add([scrollContainer,this.title]);
	}

	getInfos() {
		let token = this.token;
		let type = 8;
		let pagesize = 1000;
		let pagenb = 0;
		let url = `/scratch-api/tokens/${token}/tickets?Type=${type}&PageNumber=${pagenb}&PageSize=${pagesize}`;
		this.LoaderAnimation(this.screenCenter[0] + 500, this.screenCenter[1] - 110);
		this.events.emit('hideIcon');
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then((response) => {
					if (response.data.tickets) {
						this.events.emit('showIcon');
						this.spinner.destroy();
						let temp = [];
						response.data.tickets
							.filter((item) => item.ticketState !== "PENDING")
							.map((val, index) => {
								temp.push(val);
							});
						this.state.ticketsInfo = temp;
						resolve();
					}
				})
				.catch(function (error) {
					reject(error);
				});
		});
	}

	getTicket() {
		let token = this.token;
		let type = 8;
		let pagesize = 1000;
		let pagenb = "0&isFinished=0";
		let url = `/scratch-api/tokens/${token}/tickets?Type=${type}&pageSize=${pagesize}&pageNumber=${pagenb}`;
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then((response) => {
					if (response.data.status === 1 && response.data.tickets.length > 0) {
						this.state.targetScore = response.data.tickets[0].prize
						this.state.ticketId = response.data.tickets[0].id;
						this.state.myArray = response.data.tickets[0].ticketValues;
						this.state.winningValue = response.data.tickets[0].winningValue;
						this.state.availableTickets = response.data.numberOfTickets;
						this.ticketAvailableNumber.setText(
							`${response.data.numberOfTickets}`
						);
						this.createRandomAnimal(response.data.tickets[0].ticketValues);

						resolve();
					} else {
						reject("no data found");
					}
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	onBuyScratch(number, scratchType) {
		const data = {
			token: this.token,
			type: scratchType,
			numberOfTickets: number,
			mobileNumber: "23479199773",
		};
		let url = `/scratch-api/tickets?isWallet=true`;
		this.LoaderAnimation(this.screenCenter[0] + 400,
			this.screenCenter[1] - 330);
		this.BuyButton.disable();
		return new Promise((resolve, reject) => {
			axios
				.post(url, data)
				.then((response) => {
					this.spinner.destroy();
					this.BuyButton.enable();
					this.getUnplayed(scratchType);
					if (this.state.availableTickets === 0 && !this.isScratched) {
						this.getTicket();
					}
					resolve();
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		});
	}

	getUnplayed(gameId) {
		let token = this.token;
		let type = 8;
		let pagesize = 1000;
		let pagenb = "0&isFinished=0";
		let url = `/scratch-api/tokens/${token}/tickets?Type=${type}&pageSize=${pagesize}&pageNumber=${pagenb}`;
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then((response) => {
					if (response.data.status == 1 && response.data.tickets != null) {
						this.state.availableTickets = response.data.numberOfTickets;
						this.ticketAvailableNumber.setText(
							`${response.data.numberOfTickets}`
						);
						resolve();
					}
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		});
	}

	playTicket(ticketId, scratchType) {
		let url = `/scratch-api/tickets`;
		let data = {
			token: this.token,
			ticketId: ticketId,
			gameType: scratchType,
		};
		return new Promise((resolve, reject) => {
			axios
				.patch(url, data)
				.then((response) => {
					this.getUnplayed(scratchType);
					resolve();
				})
				.catch(function (error) {
					reject(error);
				});
		});
	}

	initializeContainer() {
		this.animalTicketCnt = this.add
			.container(this.screenCenter[0] - 70, this.screenCenter[1] - 220)
			.setDepth(1);
	}

	createRandomAnimal(values, type) {
		if (values) {
			this.animalTicketCnt.removeAll(true);

			let arrayAhbal = [];
			if (type !== "onevalue") {
				values.map((object) => {
					arrayAhbal = arrayAhbal.concat(object.value);
				});

				this.animalTicketCnt.add(
					this.createAnimal("img", this, 20, 0, arrayAhbal[0]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 220, 0, arrayAhbal[1]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, -70, 110, arrayAhbal[2]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 110, 110, arrayAhbal[3]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 310, 110, arrayAhbal[4]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, -70, 230, arrayAhbal[5]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 110, 230, arrayAhbal[6]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 310, 230, arrayAhbal[7]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 20, 350, arrayAhbal[8]).setScale(0.75)
				);
				this.animalTicketCnt.add(
					this.createAnimal("img", this, 220, 350, arrayAhbal[9]).setScale(0.75)
				);
			} else {
				this.animalTicketCnt.add(
					this.createAnimal("img", this, -20, 160, values.value).setScale(0.75)
				);
			}
		} else return;
	}

	animateScore(type,score) {
		console.log('targetscore',score)
		this.time.delayedCall(1000, () => {
			if (type === "winning") {
				this.winningsound.play();
				this.createBallAnimation();
				this.tweens.add({
					targets: this.resultContainer,
					y: this.cameras.main.centerY - 50,
					alpha: 1,
					duration: 1200,
					scaleX: 1.5,
					scaleY: 1.5,
					yoyo: true,
					ease: "Power2",
					onComplete: function () {
					},
				});
				this.tweens.add({
					targets: { score: this.initialScore },
					score: score,
					duration: 800,
					onUpdate: (tween) => {
						this.currentScore = Math.round(tween.getValue());
						this.text.setText(`Gain \n${this.currentScore}`);
					},
					onComplete: () => {
						this.currentScore = score;
						this.text.setText(`Gain \n${this.currentScore}`);
					},
				});
			} else {
				this.tweens.add({
					targets: this.resultContainerLoosing,
					y: this.cameras.main.centerY - 50,
					alpha: 1,
					duration: 1200,
					scaleX: 1.5,
					scaleY: 1.5,
					yoyo: true,
					ease: "Power2",
					onComplete: function () {
					},
				});
				this.loosingsound.play();
			}
		});
	}

	createBallAnimation() {
		this.manWalking = this.physics.add
			.sprite(this.screenCenter[0] - 265, 140, "manWalk")
			.setOrigin(0)
			.setDepth(5)
			.setScale(1.07);

		this.manWalking.body.velocity.x = -0;

		this.anims.create({
			key: "walk",
			frames: this.anims.generateFrameNumbers("manWalk"),
			frameRate: 12,
			repeat: -1,
		});
		this.manWalking.play("walk");
	}

	stopManWalkingAnimation() {
		this.manWalking.anims.stop("walk");
		this.manWalking.setFrame(0);
		this.manWalking.destroy();
	}

	createAnimal(type, scene, x, y, image) {
		let AnimalItem = null;
		if (type === "img") {
			AnimalItem = scene.add.image(x, y, image).setScale(0.5).setOrigin(1, 0);
		} else {
			AnimalItem = scene.add
				.text(x, y, image, { fontSize: "30px" })
				.setOrigin(0.5);
		}
		return AnimalItem;
	}
	createAnimalWithText(x, y, text, image) {
		this.createAnimal("img", this, x, y, image).setScale(0.7).setDepth(2);
		this.add
			.text(x - 15, y + 120, text, {
				fontFamily: "Inter",
				fontSize: "16px",
				fill: "#000",
			})
			.setDepth(2)
			.setOrigin(1);
	}
	createAnimalBoard() {
		this.overlayContainer = this.add.container(0, 0).setDepth(10);
		this.InfoContainer = this.add
			.container(this.screenCenter[0] - 210, this.screenCenter[1] - 145)
			.setDepth(10);

		const closeButton = this.add
			.text(550, -50, "X", {
				fontFamily: "Black Ops One",
				fontSize: "32px",
				fill: "#000",
			})
			.setDepth(2)
			.setOrigin(1);
		closeButton.setInteractive();

		closeButton.on("pointerdown", () => {
			this.overlayContainer.setVisible(false);
			this.InfoContainer.setVisible(false);
			this.buttonClick.play();
		});

		closeButton.on("pointerover", () => {
			this.input.setDefaultCursor("pointer");
		});

		const board_info = this.add
			.image(this.screenCenter[0], this.screenCenter[1], "info-board")
			.setDisplaySize(800, 500);

		this.overlayContainer.add(board_info, this.InfoContainer);
		this.overlayContainer.setVisible(false);
		this.InfoContainer.setVisible(false);
		this.InfoContainer.add(closeButton);

		let arrayImage = [
			"EA1",
			"EA2",
			"EA3",
			"EA4",
			"EA5",
			"EA6",
			"EA7",
			"EA8",
			"EA9",
			"EA10",
		];
		let arrayText = [
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
			"x3=000",
		];

		for (let i = 0; i < arrayImage.length; i++) {
			for (let l = 0; l < arrayText.length; l++) {
				for (let y = 0; y <= 1; y++) {
					for (let x = 0; x <= 4; x++) {
						this.InfoContainer.add(
							this.createAnimal(
								"img",
								this,
								x * 130,
								y * 180,
								arrayImage[i]
							).setScale(0.8)
						);
						this.InfoContainer.add(
							this.add
								.text(x * 130 - 15, y * 180 + 120, arrayText[i], {
									fontFamily: "Inter",
									fontSize: "16px",
									fill: "#000",
								})
								.setDepth(2)
								.setOrigin(1)
						);
						i++;
					}
				}
			}
		}
	}

	createTexture() {
		this.coverImage = this.textures.get(COVER_TEXTURE).getSourceImage();

		let texture = this.textures.get("coverTexture");
		if (!texture || !this.coverHelperCanvas) {
			this.textures.remove(texture);
			this.coverHelperCanvas = this.textures.createCanvas(
				"coverTexture",
				this.coverImage.width,
				this.coverImage.height
			);
		}

		this.coverHelperCanvas.context.globalCompositeOperation = "source-over";
		this.coverHelperCanvas.draw(0, 0, this.coverImage);
		this.coverHelperCanvas.context.globalCompositeOperation = "destination-out";
	}

	scratchOff() {
		this.precent = this.add.text(10, 10, "");

		let cover = this.add
			.image(this.screenCenter[0], this.screenCenter[1], "coverTexture")
			.setInteractive()
			.setDepth(2)
			.setScale(1.1);

		if (cover.on("pointerdown", this.startDrawing, this))
			if (cover.on("pointerup", this.stopDrawing, this))
				if (cover.on("pointermove", this.clearCover, this))
					this.checkTimer = this.time.addEvent({
						delay: 250,
						loop: true,
						callback: this.checkPercent,
						callbackScope: this,
					});
	}

	startDrawing() {
		this.isPointerDown = true;
	}

	stopDrawing() {
		this.isPointerDown = false;
	}

	clearCover(e, x, y) {
		if (
			this.isPointerDown &&
			!this.isScratched &&
			this.state.availableTickets > 0
		) {
			let radius = 50;
			this.coverHelperCanvas.context.beginPath();
			this.coverHelperCanvas.context.arc(x, y, radius, 0, Math.PI * 2, false);
			this.coverHelperCanvas.context.fill();
			this.coverHelperCanvas.update();
			this.onScratchParticles();
		}
	}
	update() {
		if (!this.isScratched) {
			this.playAgain.disable();
			this.scratchAllBtn.enable();
		} else {
			this.playAgain.enable();
			this.scratchAllBtn.disable();
		}
		if (this.state.availableTickets === 0 || this.isScratched) {
			this.scratchAllBtn.disable();
		} else {
			this.scratchAllBtn.enable();
		}
	}

	onScratchParticles() {
		this.particles = this.add.particles(EMITTER);
		const emitterConfig = {
			x: this.input.x,
			y: this.input.y,
			speed: { min: 100, max: 200 },
			gravityY: 500,
			lifespan: 500,
			scale: 0.01,
			maxParticles: 5,
		};
		this.emitter = this.particles.createEmitter(emitterConfig);
	}

	destroyParticles() {
		if (this.emitter) {
			this.emitter.stop();
			this.particles.removeEmitter(this.emitter);
			this.emitter = null;
		}
	}

	checkPercent() {
		let full = this.coverImage.width * this.coverImage.height;
		let { data } = this.coverHelperCanvas.context.getImageData(
			0,
			0,
			this.coverImage.width,
			this.coverImage.height
		);
		let current = data.filter((v, i) => (i + 1) % 4 == 0 && v > 0).length;
		let percentage = ((current / full) * 100).toFixed(2);
		if (percentage <= 50) {
			this.playTicket(this.state.ticketId, 8);
			this.coverHelperCanvas.context.clearRect(
				0,
				0,
				this.coverImage.width,
				this.coverImage.height
			);
			this.coverHelperCanvas.context.beginPath();
			this.coverHelperCanvas.update();
			this.destroyParticles();
			this.checkTimer.remove();
			this.isScratched = true;
			// this.score += 50;
			if (this.state.winningValue !== "losing") {
				this.animateScore("winning",this.state.targetScore);
			} else {
				this.animateScore("loosing",0);
			}
		}
	}

	addTickets() {
		this.ticketCount++;
		this.ticketCounter.setText(`${this.ticketCount}`);
	}

	removetickets() {
		if (this.ticketCount <= 0) {
			return;
		}
		this.ticketCount--;
		this.ticketCounter.setText(`${this.ticketCount}`);
	}

	buyTicket() {
		if (this.ticketCount > 0) {
			this.ticketToPlay += this.ticketCount;
			this.onBuyScratch(parseFloat(this.ticketCount), 8);
			this.ticketCount = 0;
			this.ticketCounter.setText(`${this.ticketCount}`);
		}
		localStorage.setItem("tickets", this.ticketToPlay);
	}

	handleScratch() {
		if (!this.isScratched) {
			this.isScratched = true;
			this.startScratchAnimation();
		}
	}

	startScratchAnimation() {
		const scratchDuration = 150;
		let radius = 40;

		const targetPositions = [
			{ x: 100, y: 300 },
			{ x: 300, y: 100 },
			{ x: 200, y: 500 },
			{ x: 500, y: 100 },
			{ x: 400, y: 500 },
			{ x: 700, y: 100 },
			{ x: 650, y: 500 },
		];

		let currentIndex = 0;

		const moveToNextPosition = () => {
			if (currentIndex < targetPositions.length - 1) {
				currentIndex++;
				const currentTarget = targetPositions[currentIndex - 1];
				const nextTarget = targetPositions[currentIndex];

				const moveTween = this.tweens.create({
					targets: this.coverHelperCanvas,
					x: nextTarget.x,
					y: nextTarget.y,
					duration: scratchDuration,
					onUpdate: (tween, target) => {
						const x = Phaser.Math.Linear(
							currentTarget.x,
							nextTarget.x,
							tween.progress
						);
						const y = Phaser.Math.Linear(
							currentTarget.y,
							nextTarget.y,
							tween.progress
						);
						this.coverHelperCanvas.context.beginPath();
						this.coverHelperCanvas.context.arc(
							x,
							y,
							radius,
							0,
							Math.PI * 2,
							false
						);
						this.coverHelperCanvas.context.fill();
						this.coverHelperCanvas.update();
					},
					onComplete: moveToNextPosition,
				});
				moveTween.play();
			}
		};

		moveToNextPosition();
	}

	Buybuttons() {
		const menuPosition = [this.screenCenter[0], this.screenCenter[1] - 330];
		this.btnsActsContainer = this.add.container().setDepth(1);
		const ticketValue = this.add
			.image(menuPosition[0] - 360, menuPosition[1], "availableTickets")
			.setDisplaySize(70, 40);
		this.BuyButton = new CustomButton(
			this,
			menuPosition[0] + 300,
			menuPosition[1],
			"greyBtn",
			"yellowBtn",
			"none",
			() => this.buyTicket(),
			150,
			40,
			"button",
			"A C H E T T E Z"
		);
		const AddButton = new CustomButton(
			this,
			menuPosition[0] + 160,
			menuPosition[1],
			"addTicketW_UnHovered",
			"addTicketOg_Hovered",
			"none",
			() => this.addTickets(),
			40,
			40,
			"button"
		);
		const removeButton = new CustomButton(
			this,
			menuPosition[0] - 160,
			menuPosition[1],
			"removeTicketW_UnHovered",
			"removeTicketOg_Hovered",
			"none",
			() => this.removetickets(),
			40,
			40,
			"button"
		);
		const counterBox = this.add
			.image(menuPosition[0], menuPosition[1], "CounterBox")
			.setDisplaySize(240, 40);
		this.btnsActsContainer.add([
			this.BuyButton,
			AddButton,
			removeButton,
			counterBox,
			ticketValue,
		]);
		this.ticketAvailableNumber = this.add
			.text(ticketValue.x, ticketValue.y, `${this.state.availableTickets}`, {
				fontSize: "24px",
				fill: "#ffff",
				fontFamily: "Inter",
			})
			.setOrigin(0.5)
			.setDepth(1);
		this.ticketCounter = this.add
			.text(counterBox.x, counterBox.y, `${this.ticketCount}`, {
				fontSize: "32px",
				fill: "#ffff",
				fontFamily: "Inter",
			})
			.setOrigin(0.5)
			.setDepth(1);
		this.ticketAvailableLabel = this.add
			.text(menuPosition[0] - 450, menuPosition[1], "T I C K E T S", {
				fontSize: "16px",
				fill: "#ffff",
				fontFamily: "Inter",
			})
			.setOrigin(0.5)
			.setDepth(1);
	}

	playAgainFct() {
		this.isScratched = false;
		this.createTexture();
		this.scratchOff();
		this.getTicket();
		if (this.state.winningValue !== "losing") {
			this.stopManWalkingAnimation();
		}
	}
}
