/*
 * ALKE WALLET
 * JavaScript principal de la aplicación.
 * Maneja sesión, navegación, saldo, transacciones y contactos.
 */

$(document).ready(function () {

    // =====================================================
    // CONTROL DE SESIÓN
    // =====================================================

    const paginaLogin = $('#loginForm').length > 0;
    const sesionActiva =
        sessionStorage.getItem('sesionActiva') === 'true';

    // Las páginas internas requieren una sesión iniciada.
    if (!paginaLogin && sesionActiva === false) {

        window.location.href = 'login.html';
        return;
    }

    // Si ya existe una sesión, no es necesario volver al formulario.
    if (paginaLogin && sesionActiva) {

        window.location.href = 'menu.html';
        return;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    $('#loginForm').submit(function (event) {

        event.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        if (email === 'admin@gmail.com' && password === '1234') {

            // Crear sesión únicamente después de validar las credenciales.
            sessionStorage.setItem('sesionActiva', 'true');

            $('#alert-container').html(`
                <div class="alert alert-success">
                    Inicio de sesión exitoso. Redirigiendo al menú...
                </div>
            `);

            setTimeout(function () {
                window.location.href = 'menu.html';
            }, 1000);

        } else {

            $('#alert-container').html(`
                <div class="alert alert-danger">
                    Email o contraseña incorrectos.
                </div>
            `);
        }
    });


    // =====================================================
    // MENÚ PRINCIPAL
    // =====================================================

    $('#btnDepositar').click(function () {

        $('#menu-message').html(`
            <div class="alert alert-info">
                Redirigiendo a Depositar...
            </div>
        `);

        setTimeout(function () {
            window.location.href = 'deposit.html';
        }, 500);
    });


    $('#btnEnviarDinero').click(function () {

        $('#menu-message').html(`
            <div class="alert alert-info">
                Redirigiendo a Enviar Dinero...
            </div>
        `);

        setTimeout(function () {
            window.location.href = 'sendmoney.html';
        }, 500);
    });


    $('#btnMovimientos').click(function () {

        $('#menu-message').html(`
            <div class="alert alert-info">
                Redirigiendo a Últimos Movimientos...
            </div>
        `);

        setTimeout(function () {
            window.location.href = 'transactions.html';
        }, 500);
    });


    // =====================================================
    // RETIROS
    // =====================================================

    $('#btnRetirar').click(function () {

        $('#menu-message').html(`
            <div class="alert alert-info">
                Redirigiendo a Retirar Dinero...
            </div>
        `);

        setTimeout(function () {
            window.location.href = 'withdraw.html';
        }, 500);
    });


    // =====================================================
    // RECIBIR DINERO
    // =====================================================

    $('#btnRecibir').click(function () {

        $('#menu-message').html(`
            <div class="alert alert-info">
                Redirigiendo a Recibir Dinero...
            </div>
        `);

        setTimeout(function () {
            window.location.href = 'receive.html';
        }, 500);
    });


    // =====================================================
    // CERRAR SESIÓN
    // =====================================================

    $('#btnCerrarSesion').click(function () {

        sessionStorage.removeItem('sesionActiva');

        $('#menu-message').html(`
            <div class="alert alert-info">
                Cerrando sesión...
            </div>
        `);

        setTimeout(function () {
            window.location.href = 'login.html';
        }, 500);
    });


    // =====================================================
    // DEPÓSITOS
    // =====================================================

    if ($('#depositForm').length > 0) {

        let saldo = parseFloat(localStorage.getItem('saldo'));

        if (isNaN(saldo)) {

            saldo = 200000;

            localStorage.setItem('saldo', saldo);
        }


        // Mostrar saldo actual
        $('#currentBalance').text('$' + saldo.toFixed(2));


        $('#depositForm').submit(function (event) {

            event.preventDefault();

            const monto =
                parseFloat($('#depositAmount').val());


            // Validar monto
            if (isNaN(monto) || monto <= 0) {

                $('#alert-container').html(`
                    <div class="alert alert-danger">
                        Ingrese un monto válido.
                    </div>
                `);

                return;
            }


            // Actualizar saldo
            saldo += monto;

            localStorage.setItem('saldo', saldo);


            // Obtener movimientos
            let movimientos =
                JSON.parse(
                    localStorage.getItem('movimientos')
                ) || [];


            // Registrar depósito
            movimientos.push({

                tipo: 'deposito',

                monto: monto,

                fecha: new Date().toLocaleString()

            });


            localStorage.setItem(
                'movimientos',
                JSON.stringify(movimientos)
            );


            // Mostrar monto depositado
            $('#depositMessage').html(`
                <div class="alert alert-info">
                    Has depositado
                    <strong>$${monto.toFixed(2)}</strong>.
                </div>
            `);


            // Mensaje de éxito
            $('#alert-container').html(`
                <div class="alert alert-success">
                    Depósito realizado correctamente.
                </div>
            `);


            // Actualizar saldo
            $('#currentBalance').text(
                '$' + saldo.toFixed(2)
            );


            // Limpiar campo
            $('#depositAmount').val('');


            // Redirigir después de 2 segundos
            setTimeout(function () {

                window.location.href = 'menu.html';

            }, 2000);

        });
    }


    // =====================================================
    // RETIROS
    // =====================================================

    if ($('#withdrawForm').length > 0) {

        let saldo = parseFloat(localStorage.getItem('saldo'));

        if (isNaN(saldo)) {
            saldo = 200000;
            localStorage.setItem('saldo', saldo);
        }

        $('#currentBalance').text('$' + saldo.toFixed(2));

        $('#withdrawForm').submit(function (event) {

            event.preventDefault();

            const monto = parseFloat($('#withdrawAmount').val());

            if (isNaN(monto) || monto <= 0) {

                $('#alert-container').html(`
                    <div class="alert alert-danger">
                        Ingrese un monto válido mayor que $0.
                    </div>
                `);

                return;
            }

            if (monto > saldo) {

                $('#alert-container').html(`
                    <div class="alert alert-danger">
                        Saldo insuficiente.
                        <br>
                        Saldo disponible: $${saldo.toFixed(2)}
                    </div>
                `);

                return;
            }

            saldo -= monto;
            localStorage.setItem('saldo', saldo);

            let movimientos =
                JSON.parse(localStorage.getItem('movimientos')) || [];

            movimientos.push({
                tipo: 'retiro',
                monto: monto,
                fecha: new Date().toLocaleString()
            });

            localStorage.setItem(
                'movimientos',
                JSON.stringify(movimientos)
            );

            $('#currentBalance').text('$' + saldo.toFixed(2));

            $('#withdrawMessage').html(`
                <div class="alert alert-success">
                    Retiro realizado correctamente.
                    <br>
                    Monto retirado: <strong>$${monto.toFixed(2)}</strong>
                    <br>
                    Nuevo saldo: <strong>$${saldo.toFixed(2)}</strong>
                </div>
            `);

            $('#withdrawAmount').val('');
        });
    }


    // =====================================================
    // RECIBIR DINERO
    // =====================================================

    if ($('#receiveForm').length > 0) {

        let saldo = parseFloat(localStorage.getItem('saldo'));

        if (isNaN(saldo)) {
            saldo = 200000;
            localStorage.setItem('saldo', saldo);
        }

        $('#currentBalance').text('$' + saldo.toFixed(2));

        $('#receiveForm').submit(function (event) {

            event.preventDefault();

            const monto = parseFloat($('#receiveAmount').val());
            const remitente = $('#receiveSender').val().trim();

            if (remitente === '') {

                $('#alert-container').html(`
                    <div class="alert alert-danger">
                        Ingrese el nombre del remitente.
                    </div>
                `);

                return;
            }

            if (isNaN(monto) || monto <= 0) {

                $('#alert-container').html(`
                    <div class="alert alert-danger">
                        Ingrese un monto válido mayor que $0.
                    </div>
                `);

                return;
            }

            saldo += monto;
            localStorage.setItem('saldo', saldo);

            let movimientos =
                JSON.parse(localStorage.getItem('movimientos')) || [];

            movimientos.push({
                tipo: 'recepcion',
                monto: monto,
                remitente: remitente,
                fecha: new Date().toLocaleString()
            });

            localStorage.setItem(
                'movimientos',
                JSON.stringify(movimientos)
            );

            $('#currentBalance').text('$' + saldo.toFixed(2));

            $('#receiveMessage').html(`
                <div class="alert alert-success">
                    Dinero recibido correctamente.
                    <br>
                    Remitente: <strong>${remitente}</strong>
                    <br>
                    Monto recibido: <strong>$${monto.toFixed(2)}</strong>
                    <br>
                    Nuevo saldo: <strong>$${saldo.toFixed(2)}</strong>
                </div>
            `);

            $('#receiveForm')[0].reset();
        });
    }


    // =====================================================
    // ENVIAR DINERO
    // =====================================================

    if ($('#contactList').length > 0) {

        let contactoSeleccionado = null;


        // =================================================
        // CARGAR CONTACTOS
        // =================================================

        function cargarContactos() {

            let contactos =
                JSON.parse(
                    localStorage.getItem('contactos')
                ) || [];


            // Contacto Garipolo
            const existeGaripolo =
                contactos.some(function (contacto) {

                    return contacto.nombre === 'Garipolo';

                });


            if (!existeGaripolo) {

                contactos.push({

                    nombre: 'Garipolo',

                    cbu: '123456789',

                    alias: 'Garipolo',

                    banco: '31 min Bank'

                });
            }


            // Contacto Policarpo
            const existePolicarpo =
                contactos.some(function (contacto) {

                    return contacto.nombre === 'Policarpo';

                });


            if (!existePolicarpo) {

                contactos.push({

                    nombre: 'Policarpo',

                    cbu: '987654321',

                    alias: 'Policarpo',

                    banco: 'XYZ Bank'

                });
            }


            // Guardar contactos
            localStorage.setItem(
                'contactos',
                JSON.stringify(contactos)
            );


            mostrarContactos(contactos);
        }


        // =================================================
        // MOSTRAR CONTACTOS
        // =================================================

        function mostrarContactos(contactos) {

            $('#contactList').empty();


            contactos.forEach(function (contacto, index) {

                const li = $(`
                    <li class="list-group-item contacto-item">

                        <strong class="contact-name">
                            ${contacto.nombre}
                        </strong>

                        <small class="d-block text-muted">
                            CBU: ${contacto.cbu}
                        </small>

                        <small class="d-block text-muted">
                            Alias: ${contacto.alias}
                        </small>

                        <small class="d-block text-muted">
                            Banco: ${contacto.banco}
                        </small>

                    </li>
                `);


                // =================================================
                // COLORES INTERCALADOS
                // =================================================

                if (index % 2 === 0) {

                    li.addClass('contacto-color-1');

                } else {

                    li.addClass('contacto-color-2');

                }


                // =================================================
                // SELECCIONAR / DESELECCIONAR
                // =================================================

                li.click(function () {


                    // -------------------------------------------------
                    // SI SE HACE CLIC EN EL MISMO CONTACTO
                    // -------------------------------------------------

                    if (contactoSeleccionado === contacto) {

                        // Deseleccionar
                        contactoSeleccionado = null;


                        // Quitar resaltado
                        li.removeClass('active');


                        // Ocultar botón Enviar dinero
                        $('#btnEnviar').hide();


                        // Mensaje
                        $('#mensaje').html(`
                            <div class="alert alert-info">
                                Contacto deseleccionado.
                            </div>
                        `);


                        return;
                    }


                    // -------------------------------------------------
                    // QUITAR SELECCIÓN ANTERIOR
                    // -------------------------------------------------

                    $('.contacto-item').removeClass('active');


                    // -------------------------------------------------
                    // SELECCIONAR NUEVO CONTACTO
                    // -------------------------------------------------

                    li.addClass('active');

                    contactoSeleccionado = contacto;


                    // Mostrar botón Enviar
                    $('#btnEnviar').show();


                    // Mostrar mensaje
                    $('#mensaje').html(`
                        <div class="alert alert-info">
                            Contacto seleccionado:
                            <strong>${contacto.nombre}</strong>
                        </div>
                    `);

                });


                $('#contactList').append(li);

            });


            // El botón comienza oculto
            if (contactoSeleccionado === null) {

                $('#btnEnviar').hide();

            }

        }


        // =================================================
        // ABRIR MODAL AGREGAR CONTACTO
        // =================================================

        $('#btnAgregarContacto').click(function () {

            $('#contactModal').modal('show');

        });


        // =================================================
        // GUARDAR NUEVO CONTACTO
        // =================================================

        $('#contactForm').submit(function (event) {

            event.preventDefault();


            const nombre =
                $('#contactName').val().trim();

            const cbu =
                $('#contactCbu').val().trim();

            const alias =
                $('#contactAlias').val().trim();

            const banco =
                $('#contactBank').val().trim();


            // Validar campos
            if (
                nombre === '' ||
                cbu === '' ||
                alias === '' ||
                banco === ''
            ) {

                $('#mensaje').html(`
                    <div class="alert alert-danger">
                        Complete todos los campos.
                    </div>
                `);

                return;
            }


            // Validar CBU
            if (!/^\d+$/.test(cbu)) {

                $('#mensaje').html(`
                    <div class="alert alert-danger">
                        El CBU debe contener solamente números.
                    </div>
                `);

                return;
            }


            // Obtener contactos
            let contactos =
                JSON.parse(
                    localStorage.getItem('contactos')
                ) || [];


            // Crear contacto
            const nuevoContacto = {

                nombre: nombre,

                cbu: cbu,

                alias: alias,

                banco: banco

            };


            contactos.push(nuevoContacto);


            // Guardar
            localStorage.setItem(
                'contactos',
                JSON.stringify(contactos)
            );


            // Limpiar formulario
            $('#contactForm')[0].reset();


            // Cerrar modal
            $('#contactModal').modal('hide');


            // Actualizar lista
            mostrarContactos(contactos);


            // Mensaje
            $('#mensaje').html(`
                <div class="alert alert-success">
                    Contacto agregado correctamente.
                </div>
            `);

        });


        // =================================================
        // BUSCAR CONTACTOS
        // =================================================

        $('#searchContact').on('input', function () {

            const texto =
                $(this).val().toLowerCase();


            $('#contactList .contacto-item').each(function () {

                const contenido =
                    $(this).text().toLowerCase();


                if (contenido.includes(texto)) {

                    $(this).show();

                } else {

                    $(this).hide();

                }

            });

        });


        // =================================================
        // ENVIAR DINERO
        // =================================================

        $('#btnEnviar').click(function () {


            // Verificar contacto
            if (contactoSeleccionado === null) {

                $('#mensaje').html(`
                    <div class="alert alert-danger">
                        Seleccione un contacto antes de enviar dinero.
                    </div>
                `);

                return;
            }


            // Obtener monto
            const monto =
                parseFloat(
                    $('#sendAmount').val()
                );


            // Validar monto
            if (isNaN(monto) || monto <= 0) {

                $('#mensaje').html(`
                    <div class="alert alert-danger">
                        Ingrese un monto válido mayor que $0.
                    </div>
                `);

                return;
            }


            // Obtener saldo
            let saldo =
                parseFloat(
                    localStorage.getItem('saldo')
                );


            if (isNaN(saldo)) {

                saldo = 200000;

            }


            // Verificar saldo
            if (monto > saldo) {

                $('#mensaje').html(`
                    <div class="alert alert-danger">

                        Saldo insuficiente.

                        <br>

                        Saldo disponible:
                        $${saldo.toFixed(2)}

                    </div>
                `);

                return;
            }


            // Descontar dinero
            saldo -= monto;


            localStorage.setItem(
                'saldo',
                saldo
            );


            // Obtener movimientos
            let movimientos =
                JSON.parse(
                    localStorage.getItem('movimientos')
                ) || [];


            // Registrar transferencia
            movimientos.push({

                tipo: 'transferencia',

                monto: monto,

                destinatario:
                    contactoSeleccionado.nombre,

                cbu:
                    contactoSeleccionado.cbu,

                alias:
                    contactoSeleccionado.alias,

                banco:
                    contactoSeleccionado.banco,

                fecha:
                    new Date().toLocaleString()

            });


            // Guardar movimientos
            localStorage.setItem(
                'movimientos',
                JSON.stringify(movimientos)
            );


            // Mostrar confirmación
            $('#mensaje').html(`
                <div class="alert alert-success">

                    <strong>
                        ¡Dinero enviado correctamente!
                    </strong>

                    <br>

                    Destinatario:
                    ${contactoSeleccionado.nombre}

                    <br>

                    Monto enviado:
                    $${monto.toFixed(2)}

                    <br>

                    Nuevo saldo:
                    $${saldo.toFixed(2)}

                </div>
            `);


            // Limpiar monto
            $('#sendAmount').val('');


            // Deseleccionar contacto
            contactoSeleccionado = null;


            // Quitar resaltado
            $('.contacto-item').removeClass('active');


            // Ocultar botón
            $('#btnEnviar').hide();

        });


        // Iniciar contactos
        cargarContactos();

    }


    // =====================================================
    // ÚLTIMOS MOVIMIENTOS
    // =====================================================

    if ($('#transactionList').length > 0) {


        // =================================================
        // OBTENER TIPO DE TRANSACCIÓN
        // =================================================

        function getTipoTransaccion(tipo) {

            switch (tipo) {

                case 'deposito':
                    return 'Depósito';

                case 'transferencia':
                    return 'Transferencia';

                case 'retiro':
                    return 'Retiro';

                case 'recepcion':
                    return 'Recepción';

                case 'compra':
                    return 'Compra';

                default:
                    return 'Movimiento';

            }

        }


        // =================================================
        // MOSTRAR ÚLTIMOS MOVIMIENTOS
        // =================================================

        function mostrarUltimosMovimientos(
            filtro = 'todos'
        ) {

            $('#transactionList').empty();


            // Obtener movimientos
            let movimientos =
                JSON.parse(
                    localStorage.getItem('movimientos')
                ) || [];


            // Filtrar
            if (filtro !== 'todos') {

                movimientos =
                    movimientos.filter(
                        function (movimiento) {

                            return movimiento.tipo === filtro;

                        }
                    );

            }


            // No hay movimientos
            if (movimientos.length === 0) {

                $('#transactionList').html(`
                    <li class="list-group-item text-center">
                        No hay movimientos para mostrar.
                    </li>
                `);

                return;
            }


            // Mostrar del más reciente al más antiguo
            movimientos
                .slice()
                .reverse()
                .forEach(
                    function (movimiento, index) {


                        let detalle = '';


                        // -------------------------------------------------
                        // DEPÓSITO
                        // -------------------------------------------------

                        if (movimiento.tipo === 'deposito') {

                            detalle = `
                                Monto depositado:
                                $${movimiento.monto.toFixed(2)}
                            `;

                        }


                        // -------------------------------------------------
                        // TRANSFERENCIA
                        // -------------------------------------------------

                        else if (
                            movimiento.tipo === 'transferencia'
                        ) {

                            detalle = `
                                Destinatario:
                                ${movimiento.destinatario}

                                <br>

                                Monto:
                                $${movimiento.monto.toFixed(2)}
                            `;

                        }


                        // -------------------------------------------------
                        // RETIRO
                        // -------------------------------------------------

                        else if (
                            movimiento.tipo === 'retiro'
                        ) {

                            detalle = `
                                Monto retirado:
                                $${movimiento.monto.toFixed(2)}
                            `;

                        }

                        // -------------------------------------------------
                        // RECEPCIÓN
                        // -------------------------------------------------

                        else if (
                            movimiento.tipo === 'recepcion'
                        ) {

                            detalle = `
                                Remitente:
                                ${movimiento.remitente}

                                <br>

                                Monto recibido:
                                $${movimiento.monto.toFixed(2)}
                            `;

                        }

                        // -------------------------------------------------
                        // COMPRA
                        // -------------------------------------------------

                        else if (
                            movimiento.tipo === 'compra'
                        ) {

                            detalle = `
                                Compra:
                                ${movimiento.descripcion || 'Compra'}

                                <br>

                                Monto:
                                $${movimiento.monto.toFixed(2)}
                            `;

                        }


                        const li = $(`
                            <li class="list-group-item movimiento-item">

                                <strong>
                                    ${getTipoTransaccion(
                            movimiento.tipo
                        )}
                                </strong>

                                <br>

                                ${detalle}

                                <br>

                                <small class="text-muted">
                                    ${movimiento.fecha}
                                </small>

                            </li>
                        `);


                        // Colores intercalados
                        if (index % 2 === 0) {

                            li.addClass(
                                'movimiento-color-1'
                            );

                        } else {

                            li.addClass(
                                'movimiento-color-2'
                            );

                        }


                        $('#transactionList').append(li);

                    }
                );

        }


        // =================================================
        // FILTRO
        // =================================================

        $('#transactionFilter').change(function () {

            const filtro = $(this).val();

            mostrarUltimosMovimientos(filtro);

        });


        // Mostrar movimientos al cargar
        mostrarUltimosMovimientos();

    }


    // =====================================================
    // ACTUALIZAR SALDO DEL MENÚ
    // =====================================================

    if (
        $('.card-body')
            .find('.alert-success')
            .length > 0
    ) {

        let saldo =
            parseFloat(
                localStorage.getItem('saldo')
            );


        if (isNaN(saldo)) {

            saldo = 200000;

        }


        $('.card-body .alert-success h3').text(
            '$' + saldo.toFixed(2)
        );

    }

});