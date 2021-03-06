var _a;
const decimalBinario = (numero, cantidadBits) => {
    let binario = "";
    while (numero > 0) {
        binario = (numero % 2).toString() + binario;
        numero >>= 1;
    }
    while (binario.length < cantidadBits) {
        binario = "0" + binario;
    }
    return binario;
};
const binarioDecimal = (binario) => {
    let decimal = 0;
    for (let i = 0; i < binario.length; i++) {
        decimal += parseInt(binario[i]) * Math.pow(2, binario.length - i - 1);
    }
    return decimal;
};
const contarUnos = (binario) => binario.split("").reduce((unos, bit) => bit == "1" ? unos + 1 : unos, 0);
const diferencias = (binario1, binario2) => {
    let cantidadDiferencias = 0;
    let indiceDiferencias = 0;
    for (let i = 0; i < binario1.length; i++) {
        if (binario1[i] != binario2[i]) {
            cantidadDiferencias++;
            indiceDiferencias = i;
        }
    }
    return [cantidadDiferencias, indiceDiferencias];
};
const convertirBinarioguion = (primoImplicante) => {
    let N = primoImplicante.reduce((accGuiones, bit) => bit == "-" ? accGuiones + 1 : accGuiones, 0);
    if (N == 0)
        return [primoImplicante];
    let c = [];
    let primo = [];
    c.push(primoImplicante);
    N = Math.pow(2, N);
    while (--N > 0) {
        primo = c.shift();
        for (let i = 0; i < primo.length; i++) {
            if (primo[i] == "-") {
                let primo1 = [...primo];
                let primo2 = [...primo];
                primo1[i] = "0";
                primo2[i] = "1";
                c.push([...primo1]);
                c.push([...primo2]);
                break;
            }
        }
    }
    return c;
};
const formarGrupos = (miniterminos, grupos) => {
    miniterminos.forEach(minitermino => {
        let binario = decimalBinario(minitermino, grupos.length - 1);
        let cantidadUnos = contarUnos(binario);
        grupos[cantidadUnos].push(binario);
    });
    return grupos;
};
const compararGrupos = (grupo1, grupo2, MARCADOS) => {
    let nuevosValores = new Set();
    let seHizoAlgunaDiferencia = false;
    for (let i = 0; i < grupo1.length; i++) {
        for (let j = 0; j < grupo2.length; j++) {
            let [cantidadDiferencias, indiceDiferencias] = diferencias(grupo1[i], grupo2[j]);
            if (cantidadDiferencias == 1) {
                MARCADOS.add(grupo1[i]);
                MARCADOS.add(grupo2[j]);
                let binarioConGuion = [...grupo1[i]];
                binarioConGuion[indiceDiferencias] = "-";
                seHizoAlgunaDiferencia = true;
                nuevosValores.add(binarioConGuion.join(""));
            }
        }
    }
    let nuevosValoresArray = Array.from(nuevosValores);
    return [seHizoAlgunaDiferencia, nuevosValoresArray];
};
const contarCantidadVariables = (N) => {
    let c = 0;
    while (N > 0) {
        N >>= 1;
        c++;
    }
    return c;
};
const mostrarResultadoLetras = (resultadoBinario) => {
    let resultadoLetras = [];
    resultadoBinario.forEach(binario => {
        let termino = "";
        for (let i = 0; i < binario.length; i++) {
            if (binario[i] == "-")
                continue;
            if (binario[i] == "0")
                termino += String.fromCharCode(65 + i) + "'";
            else
                termino += String.fromCharCode(65 + i);
        }
        resultadoLetras.push(termino);
    });
    return resultadoLetras.join(" + ");
};
const mostrarGrupos = (grupos) => {
    let g = document.getElementById("grupos");
    for (let i = 0; i < grupos.length; i++) {
        if (grupos[i].length == 0)
            continue;
        let tabla = document.createElement("table");
        //  pon en la tabla border 1
        tabla.setAttribute("border", "1");
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerHTML = `Grupo ${i} `;
        th.setAttribute("colspan", "2");
        tr.appendChild(th);
        tabla.appendChild(tr);
        for (let j = 0; j < grupos[i].length; j++) {
            tr = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let miniterminosNumeros = "";
            convertirBinarioguion([...grupos[i][j]]).forEach(binario => {
                miniterminosNumeros += binarioDecimal(binario.join("")) + ",";
            });
            td1.innerHTML = `(${miniterminosNumeros.slice(0, -1)})`;
            td2.innerHTML = grupos[i][j];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tabla.appendChild(tr);
            g.appendChild(tabla);
        }
    }
    let hr = document.createElement("hr");
    hr.setAttribute("width", "100%");
    g.appendChild(hr);
};
const mostrarTablaMarcados = (PRM_IMP) => {
    let binarioMiniterminos = new Map();
    let todosLosTerminos = [];
    for (let i = 0; i < PRM_IMP.length; i++) {
        let terDecimal = [];
        let res = convertirBinarioguion([...PRM_IMP[i]]);
        for (let j = 0; j < res.length; j++) {
            let decimal = binarioDecimal(res[j].join(""));
            terDecimal.push(decimal);
            todosLosTerminos.push(decimal);
        }
        binarioMiniterminos.set(PRM_IMP[i], terDecimal);
    }
    todosLosTerminos = todosLosTerminos.filter((elem, index, self) => index == self.indexOf(elem));
    todosLosTerminos.sort();
    let contenedorMarcados = document.getElementById("contenedor-marcados");
    let tablaMarcados = document.createElement("table");
    tablaMarcados.setAttribute("border", "1");
    let th = document.createElement("th");
    th.innerHTML = "Miniterminos";
    tablaMarcados.appendChild(th);
    for (let i = 0; i < todosLosTerminos.length; i++) {
        th = document.createElement("th");
        th.innerHTML = String(todosLosTerminos[i]);
        tablaMarcados.appendChild(th);
    }
    let letras = "";
    for (let i = 0; i < PRM_IMP[0].length; i++) {
        letras += String.fromCharCode(65 + i) + ",";
    }
    th = document.createElement("th");
    th.innerHTML = `(${letras.slice(0, -1)})`;
    tablaMarcados.appendChild(th);
    for (let i = 0; i < PRM_IMP.length; i++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let minis = binarioMiniterminos.get(PRM_IMP[i]);
        td.innerHTML = binarioMiniterminos.get(PRM_IMP[i]).join(",");
        tr.appendChild(td);
        for (let j = 0; j < todosLosTerminos.length; j++) {
            td = document.createElement("td");
            td.innerHTML = " ";
            if (minis.includes(todosLosTerminos[j])) {
                td.innerHTML = "X";
            }
            tr.appendChild(td);
        }
        td = document.createElement("td");
        td.innerHTML = PRM_IMP[i];
        tr.appendChild(td);
        tablaMarcados.appendChild(tr);
    }
    contenedorMarcados.innerHTML = "";
    contenedorMarcados.appendChild(tablaMarcados);
};
(_a = document.getElementById("btnCalcular")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    document.getElementById("grupos").innerHTML = "";
    let m = document.getElementById("miniterminos").value;
    let miniterminos = m.split(",").map(minitermino => parseInt(minitermino));
    let cantidadVariables = contarCantidadVariables(Math.max(...miniterminos));
    if (miniterminos.length == 1 && miniterminos[0] == 0) {
        cantidadVariables++;
    }
    console.log(cantidadVariables);
    let grupos = [];
    let gruposAuxiliar = [];
    for (let i = 0; i <= cantidadVariables; i++) {
        grupos.push([]);
        gruposAuxiliar.push([]);
    }
    grupos = formarGrupos(miniterminos, grupos);
    let seHizoAlgunaDiferencia = true;
    let seHizoAlgunaDiferenciaAux = true;
    let PRM_IMP = [];
    while (seHizoAlgunaDiferencia) {
        mostrarGrupos(grupos);
        let TODOS = new Set();
        grupos.forEach(grupo => grupo.forEach(binario => TODOS.add(binario)));
        let MARCADOS = new Set();
        seHizoAlgunaDiferencia = false;
        for (let i = 0; i < grupos.length - 1; i++) {
            if (grupos[i].length == 0)
                continue;
            let valoresUnionDeDosGrupos = [];
            [seHizoAlgunaDiferenciaAux, valoresUnionDeDosGrupos] = compararGrupos(grupos[i], grupos[i + 1], MARCADOS);
            gruposAuxiliar[i] = [...valoresUnionDeDosGrupos];
            if (seHizoAlgunaDiferenciaAux)
                seHizoAlgunaDiferencia = true;
        }
        TODOS.forEach(binario => !MARCADOS.has(binario) ? PRM_IMP.push(binario) : null);
        grupos = [...gruposAuxiliar];
        gruposAuxiliar = gruposAuxiliar.map(_ => []);
    }
    let tablaMarcados = [];
    for (let i = 0; i <= Math.pow(2, cantidadVariables); i++)
        tablaMarcados.push([0, 0]);
    //MARCAMOS LA TABLA
    for (let i = 0; i < PRM_IMP.length; i++) {
        convertirBinarioguion([...PRM_IMP[i]]).forEach(binario => {
            let decimal = binarioDecimal(binario.join(""));
            tablaMarcados[decimal][0]++;
            tablaMarcados[decimal][1] = i;
        });
    }
    let resultadoBinario = new Set();
    tablaMarcados.forEach(minitermino => minitermino[0] == 1 ? resultadoBinario.add(PRM_IMP[minitermino[1]]) : null);
    document.getElementById("primos-implicantes").innerHTML = "<strong>Primos implicantes: </strong>" + [...resultadoBinario].join(",");
    document.getElementById("resultado").innerHTML = "<strong>Resultado:</strong>  " + mostrarResultadoLetras(resultadoBinario);
    mostrarTablaMarcados(PRM_IMP);
});
