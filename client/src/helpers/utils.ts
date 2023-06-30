import Game from "../scenes/game"
import { Card } from "../model/card";
import CardSprite from "../model/cardSprite";
import { Deck } from "../model/deck";
import { themeColors } from "./uiHandler";
import { Scene } from "phaser";

export default class Utils<T> {

    /**
     * checks if last x elements in an array are equal
     * @param arr - array to check
     * @param x - number of elements from end to compare
     * @returns - true if last x elements of array (arr) are equal to each other
     */
    public areLastXValuesEqual(arr: any[], x: number): boolean {
        if (arr.length < x) {
            return false;
        }

        const lastXValues = arr.slice(arr.length - x);

        // Check if all values in the lastXValues array are equal
        return lastXValues.every((value, index, array) => value.value === array[0].value);
    }


    /**
       * Find and remove sprite associated with a given card in a scene
       * @param scene  - scene to search
       * @param card - card associated with sprite
       */
    removeSprite(scene: Game, card: Card): void {
        this.findSprite(scene, card).destroy(true);
    }

    /**
     * Find sprite associated with a given card object in the scene
     * @param scene - scene to searc
     * @param card - card associated with sprite
     * @returns card sprite associated with card
     */
    findSprite(scene: Game, card: Card): CardSprite {

        let sprite = scene.children.list.find(obj => {
            if (obj instanceof CardSprite) {
                return obj?.card?.key === card.key;
            }
        })

        if (sprite instanceof CardSprite) { return sprite }
        else return null;
    }

     /**
     * Gets single array from all played cards with is a deck of decks array.
     * @param playedCardsDeck - array of hands played to flatten
     * @returns - array of all cards in deck array
     */
     getAllPlayedCards(playedCardsDeck: Deck[]): Card[] {

        return playedCardsDeck.flatMap((deck: Deck) => deck.cards)

    }

    /**
     * 
     * @param scene - scene to show toast in
     * @param x - x position of toast
     * @param y - y position of toast
     * @param message - message to show
     * @param duration - length to show message (in ms)
     */
    createToast(scene: Game, message: string, duration: number = 3000, x?: number, y?: number) {
        const toast = scene.add.text(
          x !== undefined ? x : scene.cameras.main.centerX,
          y !== undefined ? y : scene.cameras.main.centerY,
          message,
          {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: themeColors.yellow,
            backgroundColor: themeColors.inactiveGray,
            padding: {
              x: 20,
              y: 10
            },
          }
          
        );
      
        toast.setOrigin(0.5);
        scene.tweens.add({
          targets: toast,
          alpha: 0,
          duration: duration,
          onComplete: () => {
            toast.destroy();
          }
        });
      }

}

