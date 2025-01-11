/* Configuración Inicial */

import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc }
    from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyA6b9NnPm7PeczXZK6NZ1ychRcD6rUhDJQ",
authDomain: "prueba-d7939.firebaseapp.com",
projectId: "prueba-d7939",
storageBucket: "prueba-d7939.firebasestorage.app",
messagingSenderId: "235303318309",
appId: "1:235303318309:web:9879cedd5fe9a2f66860cc"
};

const app = initializeApp(firebaseConfig);

/*Código distinto a la configuración adicional de nuestra Cloud Firestore */

let db = getFirestore(app);
let empleadosRef = collection(db, "empleados");
let empleadosSelect = document.getElementById("empleadosSelect");

async function cargarEmpleados() {
    empleadosSelect.innerHTML = '<option value="">---Selecciona Un Empleado---</option>';
    try {
        let querySnapshot = await getDocs(empleadosRef);
        querySnapshot.forEach((doc) => {
            let empleado = doc.data();
            let option = document.createElement("option");
            option.value = doc.id; // Almacena el ID del documento en el valor de la opción
            option.text = empleado.apellido;
            empleadosSelect.add(option);
        });
    } catch(e) {
        console.error(`iNo Fue Posible Cargar La Lista De Documentos Debido Al Error ${e}!`);
        alert("iNo Fue Posible Cargar La Lista De Empleados!");
    }
}

cargarEmpleados().then();

function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("departamento").selectedIndex = 0;
    document.getElementById("cpermanente").selectedIndex = 0;
    document.getElementById("nempleado").value = "";
    empleadosSelect.selectedIndex = 0;
}

let registrar = document.getElementById("registrar");
registrar.addEventListener("click", async () => {
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let departamento = document.getElementById("departamento").value;
    let cpermanente = document.getElementById("cpermanente").value;
    let nempleado = document.getElementById("nempleado").value;

    if (nombre === "" || apellido === "" || nempleado === "" || departamento === "default" || cpermanente === "default") {
        alert("iPor Favor, Completa Toda La Información Solicitada!");
        return;
    }

    try {
        let nuevoEmpleado = {
            nombre: nombre,
            apellido: apellido,
            departamento: departamento,
            cpermanente: cpermanente,
            nempleado: parseInt(nempleado)
        };

        let docRef = await addDoc(empleadosRef, nuevoEmpleado);
        console.log(`Documento Registrado Con El ID ${docRef.id}`);
        alert("iEmpleado Registrado Con Éxito!");
        limpiarCampos();
        await cargarEmpleados();
    } catch(e) {
        console.error(`iNo Fue Posible Agregar El Documento Debido Al Error ${e}!`);
        alert("Error Al Registrar El Empleado.");
    }
});

async function mostrarEmpleado(empleadoId) {
    try {
        let docRef = doc(db, "empleados", empleadoId);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let empleado = docSnap.data();
            document.getElementById("nombre").value = empleado.nombre;
            document.getElementById("apellido").value = empleado.apellido;
            document.getElementById("departamento").value = empleado.departamento;
            document.getElementById("cpermanente").value = empleado.cpermanente;
            document.getElementById("nempleado").value = empleado.nempleado;
        } else {
            console.log("iEl Documento No Existe!");
            alert("iEl Empleado No Existe!");
        }
    } catch (e) {
        console.error(`iNo Fue Posible Mostrar El Documento Debido Al Error ${e}!`);
        alert("iNo Fue Posible Mostrar El Documento!");
    }
}

empleadosSelect.addEventListener("change", () => {
    let empleadoId = empleadosSelect.value;
    if (empleadoId)
        mostrarEmpleado(empleadoId).then();
    else
        limpiarCampos();
});

let actualizar = document.getElementById("actualizar");
actualizar.addEventListener("click", async () => {
    let empleadoId = empleadosSelect.value;
    let nombre = document.querySelector("#nombre").value;
    let apellido = document.querySelector("#apellido").value;
    let departamento = document.querySelector("#departamento").value;
    let cpermanente = document.querySelector("#cpermanente").value;
    let nempleado = document.querySelector("#nempleado").value;

    if (nombre === "" || apellido === "" || nempleado === "" || departamento === "default" || cpermanente === "default") {
        alert("iPor Favor, Completa Toda La Información Solicitada!");
        return;
    }

    if (empleadoId) {
        try {
            let empleadoRef = doc(db, "empleados", empleadoId);

            let empleadoActualizado = {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                departamento: departamento,
                cpermanente: cpermanente,
                nempleado: parseInt(document.getElementById("nempleado").value)
            };

            await updateDoc(empleadoRef, empleadoActualizado);
            console.log("iDocumento Actualizado Con Éxito!");
            alert("iEmpleado Actualizado Con Éxito!");
            await cargarEmpleados();
        } catch(e) {
            console.error(`iNo Fue Posible Actualizar El Documento Debido Al Error ${e}!`);
            alert("iNo Fue Posible Actualizar Al Empleado!");
        }
    } else {
        alert("iPor Favor, Selecciona Un Empleado De La Lista!");
    }
});

let eliminar = document.getElementById("eliminar");
eliminar.addEventListener("click", async () => {
    let empleadoId = empleadosSelect.value;
    if (empleadoId) {
        try {
            await deleteDoc(doc(db, "empleados", empleadoId));
            console.log("iDocumento Eliminado Con Éxito!");
            alert("iEmpleado Eliminado Con Éxito!");
            limpiarCampos();
            await cargarEmpleados();
        } catch(e) {
            console.error(`iNo Fue Posible Eliminar El Documento Debido Al Error ${e}!`);
            alert("iNo Fue Posible Eliminar Al Wmpleado!");
        }
    } else {
        alert("iPor Favor, Selecciona Un Empleado De La Lista!");
    }
});

let limpiar = document.getElementById("limpiar");
limpiar.addEventListener("click", () => {
    limpiarCampos();
});






