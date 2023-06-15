import * as Phaser from "phaser";

/**
 * Area where cards can be set
 */
export default class Zone {
    renderZone: () => Phaser.GameObjects.Zone;
    renderOutline: (dropZone: Phaser.GameObjects.Zone) => void;
    dropZone: Phaser.GameObjects.Zone; 

    constructor(scene: Phaser.Scene) {

        //Create drop zone for cards
        this.renderZone = () => {
            let dropZone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250);
            dropZone.setData({cards: 0})
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics(); 
            dropZoneOutline.lineStyle(4, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        }
    }
}