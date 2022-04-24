const decimalBinario = (numero: number, cantidadBits:number): string => {
  let binario: string = "";

  while (numero > 0) {
    binario = (numero % 2).toString() + binario;
    numero >>= 1;
  }
  while (binario.length < cantidadBits) {
    binario = "0" + binario;
  }
  return binario;
}
const binarioDecimal = (binario: string): number => {
  let decimal: number = 0;
  for (let i = 0; i < binario.length; i++) {
    decimal += parseInt(binario[i]) * Math.pow(2, binario.length - i - 1 );
  }
  return decimal
}

const contarUnos = (binario:string): number => binario.split("").reduce((unos, bit) => bit == "1" ? unos+1: unos, 0);  
 
const diferencias = (binario1: string, binario2: string): [number, number] => {
  let cantidadDiferencias: number = 0;
  let indiceDiferencias: number = 0;

  for (let i = 0; i < binario1.length; i++) {
    if (binario1[i] != binario2[i]) {
      cantidadDiferencias++;
      indiceDiferencias = i;
    }
  }
  return [cantidadDiferencias, indiceDiferencias];
}
const convertirBinarioguion = (primoImplicante:Array<string>):string[][] =>{

  let N :number = primoImplicante.reduce((accGuiones,bit) => bit == "-" ? accGuiones + 1: accGuiones,0); 
  if (N == 0)return [primoImplicante];
  
  let c: string[][] = [];
  let primo: Array<string> = [];
  c.push(primoImplicante);

  N = Math.pow(2,N);

  while (--N > 0) {
    primo = c.shift();
    for (let i = 0; i < primo.length; i++) {
      if (primo[i] == "-") {
        let primo1: Array<string> = [...primo];
        let primo2: Array<string> = [...primo];
        primo1[i] = "0";
        primo2[i] = "1";
        c.push([...primo1]);
        c.push([...primo2]);
        break;
      }
    }
  }
  return c

}

const formarGrupos = (miniterminos: Array<number>,grupos: string[][]): string[][] => {
  
  miniterminos.forEach(minitermino => {
    let binario: string = decimalBinario(minitermino, grupos.length - 1);
    let cantidadUnos: number = contarUnos(binario);
    grupos[cantidadUnos].push(binario);
  });
  return grupos;
}
const compararGrupos = (grupo1: Array<string>, grupo2: Array<string>,MARCADOS:Set<string>): any => {
  let nuevosValores: Set<string> = new Set();
  let seHizoAlgunaDiferencia: boolean = false;
  
  for (let i = 0; i < grupo1.length; i++) {
    for (let j = 0; j < grupo2.length; j++) {
      let [cantidadDiferencias, indiceDiferencias] = diferencias(grupo1[i], grupo2[j]);
      if (cantidadDiferencias == 1) {
        MARCADOS.add(grupo1[i]);
        MARCADOS.add(grupo2[j]);
        let binarioConGuion:Array<string> = [...grupo1[i]];
        binarioConGuion[indiceDiferencias] = "-";
        seHizoAlgunaDiferencia = true
        nuevosValores.add(binarioConGuion.join(""));
      }
    }
  }
  // convierte nuevosValores a un array
  let nuevosValoresArray: Array<string> = Array.from(nuevosValores);
  return [seHizoAlgunaDiferencia,nuevosValoresArray];
}

(function main() {
  const prompt = require("prompt-sync")();
  let miniterminos:Array<number> = prompt("Ingresa los miniterminos: ").split(",").map(minitermino => parseInt(minitermino));
  const cantidadVariables: number = Math.ceil(Math.sqrt(Math.max(...miniterminos)));
  let grupos: string[][] = [];
  let gruposAuxiliar: string[][] = [];
  for (let i = 0; i <= cantidadVariables; i++) {
    grupos.push([]);
    gruposAuxiliar.push([]);
  }
  grupos = formarGrupos(miniterminos, grupos);
  let seHizoAlgunaDiferencia: boolean = true;
  let seHizoAlgunaDiferenciaAux: boolean = true;
  let primosImplicantes: Array<string> = [];
  
  while (seHizoAlgunaDiferencia) {
    let TODOS: Set<string> = new Set();
    grupos.forEach(grupo => grupo.forEach(binario => TODOS.add(binario)));
    let MARCADOS: Set<string> = new Set();
    seHizoAlgunaDiferencia = false;

    for (let i = 0; i < grupos.length - 1; i++) {
      if(grupos[i].length == 0) continue;
      let valoresUnionDeDosGrupos : Array<string> = [];
      [seHizoAlgunaDiferenciaAux,valoresUnionDeDosGrupos] = compararGrupos(grupos[i], grupos[i + 1],MARCADOS);
      gruposAuxiliar[i] = [...valoresUnionDeDosGrupos];
      if (seHizoAlgunaDiferenciaAux) seHizoAlgunaDiferencia = true;

    }
    TODOS.forEach(binario => !MARCADOS.has(binario) ? primosImplicantes.push(binario) : null);
    grupos = [...gruposAuxiliar];
    gruposAuxiliar = gruposAuxiliar.map( _ => []);

  }
  let tablaMarcados :number[][] = [];
  for(let i = 0 ; i <= Math.pow(2,cantidadVariables); i++) tablaMarcados.push([0,0]);
    
  for(let i = 0 ; i < primosImplicantes.length ; i++){
    convertirBinarioguion([...primosImplicantes[i]]).forEach(binario => {
      let decimal:number = binarioDecimal(binario.join(""));
      tablaMarcados[decimal][0]++;
      tablaMarcados[decimal][1] = i;
    })
  }
  let resultadoBinario:Set<string> = new Set();
  tablaMarcados.forEach(minitermino => {
    if(minitermino[0] == 1){
      resultadoBinario.add(primosImplicantes[minitermino[1]]);
    }
  })
  let resultadoLetras: Array<string> = [];

  resultadoBinario.forEach(binario => {
    let termino: string = "";
    for(let i = 0; i < binario.length; i++ ){
      if(binario[i] == "-")continue;
      if(binario[i] == "0") termino += "~" + String.fromCharCode(65 + i); 
      else termino += String.fromCharCode(65 + i);
    }
    resultadoLetras.push(termino);
  })
  console.log(resultadoLetras.join(" + "));

}
)();
