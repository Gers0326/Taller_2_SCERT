//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

//Caracteristicas del contrato
contract contratoVenta {
    address public propietario;
    uint256 public tiempoActualizar;
    string public descriptionCompra;
    uint public costo;
    bool public enVenta = true;

    //Evento que mostrará el estado de la compra
    event estado(string _msg, address usuario, uint monto, uint tiempo);

    //Contiene todos los requisitos del contrato
    constructor(string memory description, uint _costo) payable {
        propietario = msg.sender;
        descriptionCompra = description;
        costo = _costo;
        tiempoActualizar = block.timestamp;
        //Estado de la contrato
        estado(description, msg.sender, msg.value, block.timestamp);
        estado("Producto en venta", msg.sender, msg.value, block.timestamp);
    }

    //Contiene todas las caracteristicas de la compra
    function comprar() public payable {
        if (msg.value >= costo && enVenta == true) {
            propietario.transfer(address(this).balance);
            propietario = msg.sender;
            enVenta = false;
            //Estado de la compra
            estado("Producto en venta", msg.sender, msg.value, block.timestamp);
            estado("Producto no a la venta", msg.sender, msg.value, block.timestamp);
        } else {
            //Si no aplica se revierte la compra
            revert();
        }
        tiempoActualizar = block.timestamp;
    }
    //Propietario tiene potestad de actualizar el costo del producto
    function actualizarCosto(uint _costo) public unicoPropietario {
        costo = _costo;
        //Estado de la actualización
        estado("Actualizacion del costo", msg.sender, costo, block.timestamp);
    }
    //Propietario tiene potestad de actualizar la descripción del producto
    function modificarDescription(string memory description) public unicoPropietario {
        descriptionCompra = description;
        //Estado de la actualización
        estado(description, msg.sender, 0, block.timestamp);
        estado("Modificacion de descripcion", msg.sender, 0, block.timestamp);
    }
    //Asignar un producto a la venta
    function ponerVenta() public unicoPropietario {
        enVenta = true;
        estado("Producto a la venta", msg.sender, 0, block.timestamp);
    }

    //Abortar un producto de la venta
    function quitarVenta() public unicoPropietario {
        enVenta = true;
        estado("Producto no en venta", msg.sender, 0, block.timestamp);
        propietario.transfer(address(this).balance);
    }
    //Modifica el comportamiento de una función
    modifier unicoPropietario {
        tiempoActualizar = block.timestamp;
        if (msg.sender != propietario) {
            revert();
        } else {
            _;
        }
    }
}