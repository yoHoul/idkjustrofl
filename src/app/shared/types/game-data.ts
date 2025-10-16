// данные системы
export interface IAllGameData {
    clickerData: IClickerGameData[];
    heroesData?: IHeroesData[];
}

export interface IClickerGameData {
    id: number;
    icon: string;
    name: string;
    baseCost: bigint;
    income: bigint;
    costMultiplier: number;
}

export interface IHeroesData {
    id: number;
    icon: string;
    name: string;
    baseCost: bigint;
}

// данные игрока
export interface IUserGameData {
    balance: bigint;
    totalIncome: bigint;
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