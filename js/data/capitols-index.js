/**
 * CAPITOLS-INDEX.JS - Registre dels 12 capítols en 4 blocs pedagògics
 */

const BLOCS_CURS = [
  {
    id: 1,
    title: "Bloc 1: Els primers diners i blindar-se",
    subtitle: "El valor del temps i evitar trampes",
    chapterIds: [1, 2, 3]
  },
  {
    id: 2,
    title: "Bloc 2: Gestionar el dia a dia i la pressió social",
    subtitle: "Despeses formiga, amics i deutes",
    chapterIds: [4, 5, 6]
  },
  {
    id: 3,
    title: "Bloc 3: Estalvi, futur i el parany de la immediatesa",
    subtitle: "Paciència vs diners fàcils",
    chapterIds: [7, 8, 9]
  },
  {
    id: 4,
    title: "Bloc 4: El salt als 18 anys i la independència",
    subtitle: "El món adult i el primer habitatge",
    chapterIds: [10, 11, 12]
  }
];

const CAPITOLS_DATA = {
  1: {
    id: 1,
    num: 1,
    title: "El primer sou",
    subtitle: "Nòmina d'estiu, sou brut vs net i hores de feina",
    desc: "Descobreix quant t'ingressen realment de 1.400 € bruts i aprèn a mesurar qualsevol compra en hores de feina.",
    goal: "Com calcular quant et queda realment al compte d'un sou brut i mesurar qualsevol caprici en hores de feina.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  2: {
    id: 2,
    num: 2,
    title: "Bancs, comptes i targetes",
    subtitle: "Dèbit vs crèdit i comissions ocultes",
    desc: "Com triar el teu primer compte jove, per què evitar les targetes revolving i què passa quan fas els 18.",
    goal: "Com triar el teu primer compte jove sense comissions i per què has de fugir de les targetes de crèdit revolving.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  3: {
    id: 3,
    num: 3,
    title: "M'arriba un bizum d'un desconegut",
    subtitle: "Estafes mòbils, Wallapop i la norma d'or",
    desc: "Reconèixer el Bizum invers, la falsa devolució i com blindar la teva app bancària.",
    goal: "Com funciona el parany del Bizum invers i per què mai has de retornar diners directament a un desconegut.",
    duration: "7 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  4: {
    id: 4,
    num: 4,
    title: "On se me'n va la pasta?",
    subtitle: "Despeses formiga i subscripcions",
    desc: "Petites fuites diàries (cafès, apps, videojocs) que sumen més de 900 € l'any sense adonar-te'n.",
    goal: "Com aplicar la regla de les 48 hores a compres impulsives i tapar les despeses formiga de 900 € a l'any.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  5: {
    id: 5,
    num: 5,
    title: "Quedem per anar a un concert",
    subtitle: "Pressupost social i pressió de colla",
    desc: "Aprendre a dir que no o proposar alternatives sense trencar el pla ni patir per la despesa.",
    goal: "Com fixar un pressupost d'oci per gaudir de la colla sense sentir vergonya ni caure en la pressió de grup.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  6: {
    id: 6,
    num: 6,
    title: "Em volen vendre el mòbil a terminis",
    subtitle: "Finançament al consum, TIN i TAE",
    desc: "La trampa del 'només 25 € al mes' i com calcular el cost total abans d'acceptar un crèdit.",
    goal: "Com desemmascarar el 'només 25 € al mes' calculant el cost real i la TAE d'un crèdit al consum.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  7: {
    id: 7,
    num: 7,
    title: "El coixí: i si em trenco el mòbil?",
    subtitle: "El fons d'emergència i la tranquil·litat",
    desc: "Com construir un fons d'entre 300 € i 500 € per a imprevistos personals sense ofegar-te.",
    goal: "Com construir un fons d'emergència de 300 € a 500 € per tenir tranquil·litat mental i gastar la resta sense culpa.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  8: {
    id: 8,
    num: 8,
    title: "Metes: d'un viatge al carnet",
    subtitle: "Objectius SMART i fites assolibles",
    desc: "Passar d'un desig inconcret a un pla setmanal d'estalvi automàtic amb data fixada.",
    goal: "Com automatitzar l'estalvi a principi de mes (pagar-te a tu primer) amb metes SMART que es compleixin.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  9: {
    id: 9,
    num: 9,
    title: "I si ho deixo créixer?",
    subtitle: "Interès compost vs paranys de 'diners fàcils'",
    desc: "El valor del temps i com blindar-te davant del fum de finfluencers i apostes a xarxes.",
    goal: "La diferència entre estalviar i invertir, què és un ETF global a foc lent i com blindar-te dels finfluencers.",
    duration: "9 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  10: {
    id: 10,
    num: 10,
    title: "La nòmina de debò",
    subtitle: "Primer contracte laboral i negociació salarial",
    desc: "Llegir una nòmina reglamentària d'adult, bases de cotització, 12 vs 14 pagues i IRPF.",
    goal: "Com interpretar una nòmina d'adult, 12 vs 14 pagues i assegurar-te que cotitzes totes les hores.",
    duration: "9 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  11: {
    id: 11,
    num: 11,
    title: "La Renda sense por",
    subtitle: "Declaració de l'IRPF per a joves",
    desc: "Quan estàs obligat a declarar, el perill de tenir 2 pagadors i com recuperar retencions.",
    goal: "Quan t'obliga a declarar tenir 2 pagadors i com recuperar les retencions d'IRPF d'estiu.",
    duration: "8 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  },
  12: {
    id: 12,
    num: 12,
    title: "Visc sol: el cop de realitat",
    subtitle: "Cost real de l'emancipació i despeses ocultes",
    desc: "Fiances, subministraments, menjar i la regla del 30% per no ofegar-te vivint sol.",
    goal: "El cop de realitat d'emancipar-te: la regla del 30% en el lloguer, les fiances i les despeses ocultes de viure sol.",
    duration: "10 min",
    statusText: "Fet i jugable",
    tagClass: "tag-done",
    playable: true
  }
};
