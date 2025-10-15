// данные системы
export interface IAllGameData {
    clickerData: IClickerGameData[];
    heroesData?: IHeroesData[];
}

export interface IClickerGameData {
    id: number;
    icon: string;
    name: string;
    baseCost: number;
    income: number;
    costMultiplier: number; // 1.1 < n < 1.3
}

export interface IHeroesData {
    id: number;
    icon: string;
    name: string;
    baseCost: number;
}

// данные игрока
export interface IUserGameData {
    balance: number;
    totalIncome: number;
    haveAccess: IUserAccessList;
    clickerData: IUserClickerGameData[];
    heroesData?: IUserHeroesData[];
}

export interface IUserAccessList {
    heroes: boolean;
}

export interface IUserClickerGameData {
    id: number;
    amount: number;
}

export interface IUserHeroesData {
    id: number;
    haveIt: boolean;
}