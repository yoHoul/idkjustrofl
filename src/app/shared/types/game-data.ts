export interface IAllGameData {
    haveAccess: IAccessList;
    clickerData: IClickerGameData[];
    heroesData?: IHeroesData[];
}

export interface IClickerGameData {
    icon: string;
    name: string;
    baseCost: number;
    income: number;
    amount: number;
    costMultiplier: number; // 1.1 < n < 1.3
}

export interface IHeroesData {

}

export interface IAccessList {
    heroes: boolean;
}