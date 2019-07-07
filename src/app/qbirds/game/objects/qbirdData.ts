import { QBirdNature } from './qbirdNature';

const GREENISH = 0xaaaa00;
const REDISH = 0xaa66aa;

export const QBIRD_DATA: Array<{
    x:number,
    y:number, 
    nature:QBirdNature,
    color: number
}> =[
    {
        x: 300,
        y: 490,
        nature: QBirdNature.EVASIVE,
        color: GREENISH
    },
    {
        x: 600,
        y: 400,
        nature: QBirdNature.AGGRESIVE,
        color: REDISH
    },
    {
        x: 350,
        y: 440,
        nature: QBirdNature.EVASIVE,
        color: GREENISH
    },
    {
        x: 500,
        y: 300,
        nature: QBirdNature.AGGRESIVE,
        color: REDISH
    },
    {
        x: 350,
        y: 450,
        nature: QBirdNature.EVASIVE,
        color: GREENISH
    },
    {
        x: 550,
        y: 330,
        nature: QBirdNature.AGGRESIVE,
        color: REDISH
    },
    {
        x: 340,
        y: 440,
        nature: QBirdNature.EVASIVE,
        color: GREENISH
    },
    {
        x: 400,
        y: 290,
        nature: QBirdNature.AGGRESIVE,
        color: REDISH
    }
]