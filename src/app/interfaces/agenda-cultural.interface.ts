export interface Event {
    codi: string;
    data_fi_aproximada?: string;
    denominaci: string;
    subt_tol?: string;
    descripcio?: string;
    tags_mbits: string;
    tags_categor_es?: string;
    entrades?: string;
    nombotoentrades?: Nombotoentrades;
    linkbotoentrades?: string;
    horari?: string;
    gratuita?: Destacada;
    permanent?: Destacada;
    ocultarpermanent?: Destacada;
    categorias: string[];
    enlla_os?: string;
    enllac1_nom?: string;
    enllac1_url?: string;
    enllac2_nom?: string;
    enllac2_url?: string;
    enllac3_nom?: string;
    enllac3_url?: string;
    modalitat?: Modalitat;
    destacada?: Destacada;
    destacada_titol?: string;
    destacada_subtitol?: string;
    destacada_imatge?: string;
    documents?: string;
    imatges: string;
    v_deos?: string;
    imgapp?: string;
    descripcio_html?: string;
    amagar_dates?: string;
    data_creacio?: Date;
    data_fi?: Date;
    data_inici?: Date;
    comarca_i_municipi?: string;
    espai?: string;
    latitud?: string;
    longitud?: string;
    municipi?: string;
    comarca?: string;
    adre_a?: string;
    url?: string;
    georefer_ncia?: GeoreferNcia;
    ":@computed_region_wvic_k925"?: string;
    ":@computed_region_bh64_c7uy"?: string;
    localitat?: string;
    tags_altres_categor_es?: TagsAltresCategorEs;
    email?: string;
    tel_fon?: string;
    regi_o_pa_s?: string;
    codi_postal?: string;
    favorite?: boolean;
}

export enum Destacada {
    No = "No",
    Sí = "Sí",
}

export interface GeoreferNcia {
    type: Type;
    coordinates: number[];
}

export enum Type {
    Point = "Point",
}

export enum Modalitat {
    Presencial = "Presencial",
    PresencialIVirtual = "Presencial i virtual",
    Virtual = "Virtual",
}

export enum Nombotoentrades {
    CompraDEntrades = "Compra d'entrades",
    CompraDEntradesEnLínia = "Compra d'entrades en línia",
    CompraEntrades = "Compra entrades",
    DinarPopular = "Dinar popular",
    Empty = "",
    Entrades = "Entrades",
    EntradesAlMuseu = "Entrades al museu",
    ReservaEntrada = "Reserva entrada",
    VendaDEntradesEnLínia = "Venda d'entrades en línia",
    VendaEnLíniaDEntrades = "Venda en línia d'entrades",
}

export enum TagsAltresCategorEs {
    AgendaAltresCategoriesActivitatsVirtuals = "agenda:altres-categories/activitats-virtuals",
    AgendaAltresCategoriesAnyJosepCercós = "agenda:altres-categories/any-josep-cercós",
    AgendaAltresCategoriesAnyJuliGarreta = "agenda:altres-categories/any-juli-garreta",
    AgendaAltresCategoriesDasc2020 = "agenda:altres-categories/dasc2020",
    AgendaAltresCategoriesDim2018 = "agenda:altres-categories/dim2018",
    AgendaAltresCategoriesProgramaCat = "agenda:altres-categories/programa-cat",
    AgendaAltresCategoriesSantjordi = "agenda:altres-categories/santjordi",
}
