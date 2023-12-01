var ambiente = JSON.parse(sessionStorage.AMBIENTE);

let proximaAtualizacao;

function exibirDadosAmbiente(idAmbiente) {
    console.log("Teste" + idAmbiente)
    document.getElementById("container-titulo").innerHTML += `
        <p id="titulo-header${idAmbiente}">   
            <a href="sensores.html"> <i class="fa fa-fw fa-solid fa-arrow-left"></i> ${ambiente[0].nome_ambiente} - ${ambiente[0].andar}</a>
        </p>
    `

    /* <canvas id='kpi_chartUmd${idAmbiente}' style="display: none;"></canvas> */
    document.getElementById("dashbaord").innerHTML = `
        <div class="container-main-content">
        <div class="container-row row1">
            <div class="container-column" >
                <div class="grafico">
                    <canvas id='kpi_chart${idAmbiente}'></canvas>
                    
                </div>
                <div>
                    <select name="select_grafico" id="select_grafico" onchange="tipoGrafico()">
                        <option value="opt_temp"> Temperatura </option>
                        <option value="opt_umd"> Umidade </option>
                    </select>
                </div>
                <table class="tabela-sensor" id='sensores'>
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Sensor </th>
                            <th> Temperatura </th>
                            <th> Umidade </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>DHT11(1)</td>
                            <td>19º</td>
                            <td>40%</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>DHT11(2)</td>
                            <td>20º</td>
                            <td>45%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="container-log">
                <div class="log-header">
                    <p> Histórico de Alertas </p>
                </div>
                <div id='historicoAlerta${idAmbiente}'>
                    <div class="log-mensagem">
                    <i class="fa-solid fa-circle-exclamation" style="color: #ff1414;"></i>
                    <p> Nível de temperatura registrado “+6º” do que esperado
                        (03-09-2023 15:24 ) </p>
                </div>
                <div class="log-mensagem">
                    <i class="fa-solid fa-circle-exclamation" style="color: #ff1414;"></i>
                    <p> Nível de umidade registrado “+3%” do que esperado
                        (03-09-2023 04:02 )</p>
                </div>
                <div class="log-mensagem">
                    <i class="fa-solid fa-circle-exclamation" style="color: #ff1414;"></i>
                    <p> Nível de umidade registrado “+4%” do que esperado
                        (03-09-2023 03:52 ) </p>
                </div>
                <div class="log-mensagem">
                    <i class="fa-solid fa-circle-exclamation" style="color: #ff1414;"></i>
                    <p> Nível de temperatura registrado “-2º” do que esperado
                        (03-09-2023 03:42 ) </p>
                </div>
                </div>
            </div>
        </div>
        <h2>KPI's Art Vision Tech</h2>
        <div class="container-row row2">
            <div class="kpi-donut">
                <canvas id="kpi_temperatura${idAmbiente}"></canvas>
            </div>
            <div class="kpi-donut">
                <canvas id="kpi_umidade${idAmbiente}"></canvas>
            </div>
            <div class="kpi-donut">
                <canvas id="kpi_ip${idAmbiente}"></canvas>
            </div>
        </div>
    </div>
    `

    obtarDadosAmbiente(idAmbiente);
}

function alterarTitulo(idAmbiente) {
    var elementoTitulo = document.getElementById(`titulo-header${idAmbiente}`)
    var nome_ambiente = JSON.parse(sessionStorage.AMBIENTE).find(item => item.idAmbiente == idAmbiente).nome_ambiente;
    var andar = JSON.parse(sessionStorage.AMBIENTE).find(item => item.idAmbiente == idAmbiente).andar;

    elementoTitulo.innerHTML = "<a href='sensores.html'> <i class='fa fa-fw fa-solid fa-arrow-left'></i> " + nome_ambiente + " - " + andar + "</a>";
}

function obterdados(idAmbiente) {
    fetch(`/medidas/tempo-real/${idAmbiente}`)
        .then(resposta => {
            if (resposta.status == 200) {
                resposta.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    /* alertar(resposta, idAmbiente); */
                });
            } else {
                console.error(`Nenhum dado encontrado para o id ${idAmbiente} ou erro na API`);
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do ambiente p/ gráfico: ${error.message}`);
        });

}  

function obtarDadosAmbiente(idAmbiente) {
    if (proximaAtualizacao != undefined) {
        clearTimeout(proximaAtualizacao);
    }

    var idAmbienteNumero = parseInt(idAmbiente);

    console.log(parseInt(idAmbiente)) 

    fetch(`/medidas/ultimas/${idAmbienteNumero}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                resposta.reverse();

                plotarGrafico(resposta, idAmbiente);

            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}


/* function tipoGrafico() {

    let tipo_grafico = select_grafico.value;
    console.log(tipo_grafico)
    if (tipo_grafico == "opt_umd") {
        kpi_chart.style.display = "none";
        kpi_chartUmd.style.display = "block";
    } else {
        kpi_chart.style.display = "block";
        kpi_chartUmd.style.display = "none";
    }

    // Função para alterar o gráfico
} */

function plotarGrafico(resposta, idAmbiente) {
    const ctx = document.getElementById(`kpi_chart${idAmbiente}`).getContext('2d');

    console.log('iniciando plotagem do gráfico...');

    let labels = [];

    let dataTempLine = {
        labels: labels,
        datasets: [
            {
                yAxisID: 'A',
                label: 'DHT11(1) Cº',
                data: [],
                borderWidth: 1,
                tension: 0.1,
                backgroundColor: 'orange',
                borderColor: 'orange'
            },
            {
                yAxisID: 'B',
                label: 'DHT11(2) Cº',
                data: [],
                borderWidth: 1,
                tension: 0.1,
                backgroundColor: 'rgba(255, 118, 51, 0.8)',
                borderColor: 'rgb(255, 118, 22)'
            },
        ]
    }

    const opcoes_temp = {
        responsive: true,
        scales: {
            A: {
                type: 'linear',
                position: 'left',
                ticks: { beginAtZero: true, color: 'orange', stepSize: 5 },
                grid: { display: false },
                suggestedMin: 5,
                suggestedMax: 35,
            },
            B: {
                type: 'linear',
                position: 'left',
                display: false,
                ticks: { beginAtZero: true, color: 'orange', stepSize: 5 },
                grid: { display: false },
                suggestedMin: 5,
                suggestedMax: 35,
            }
        },
    };

    const configTempLine = {
        type: 'line',
        data: dataTempLine,
        options: opcoes_temp
    }

    console.log('----------------------------------------------')
    console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
    console.log(resposta)

    // Inserindo valores recebidos em estrutura para plotar o gráfico
    for (i = 0; i < resposta.length; i++) {
        var registro = resposta[i];
        labels.push(registro.momento_grafico);
        dataTempLine.datasets[0].data.push(registro.temperatura);
        dataTempLine.datasets[1].data.push(registro.temperatura);
    }

    console.log(dataTempLine)

    let chartTempLine = new Chart(ctx, {
        configTempLine
    });

    setTimeout(() => atualizarGrafico(idAmbiente, dataTempLine, chartTempLine), 2000);


    /* const ctxUmd = document.getElementById(`kpi_chartUmd${idAmbiente}`).getContext('2d');
    const chartUmd = new Chart(ctxUmd, {
        type: 'line',
        data: {
            labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00'],
            datasets: [
                {
                    yAxisID: 'A',
                    label: 'DHT11(1) UR%',
                    data: [47, 55, 53, 60, 57, 51, 47, 46, 50, 52, 48, 56, 60],
                    borderWidth: 1,
                    backgroundColor: 'blue',
                    borderColor: 'blue'
                },
                {
                    yAxisID: 'B',
                    label: 'DHT11(2) UR%',
                    data: [50, 52, 50, 56, 53, 49, 47, 42, 47, 50, 46, 51, 54],
                    borderWidth: 1,
                    backgroundColor: 'rgba(0, 142, 252, 0.8)',
                    borderColor: 'rgb(0, 31, 252)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                A: {
                    type: 'linear',
                    position: 'left',
                    ticks: { beginAtZero: true, color: 'blue', stepSize: 10 },
                    grid: { display: false },
                    suggestedMin: 10,
                    suggestedMax: 90,
                },
                x: { ticks: { beginAtZero: true } },
                B: {
                    type: 'linear',
                    position: 'left',
                    display: false,
                    ticks: { beginAtZero: true, color: 'blue', stepSize: 5 },
                    grid: { display: false },
                    suggestedMin: 10,
                    suggestedMax: 90,
                }
            }
        }
    }); */

    const ctxTemp = document.getElementById(`kpi_temperatura${idAmbiente}`).getContext('2d');
    const ctxUr = document.getElementById(`kpi_umidade${idAmbiente}`).getContext('2d');
    const ctxIp = document.getElementById(`kpi_ip${idAmbiente}`).getContext('2d');

    const dataValueTemp = [91.67, 8.33]
    const dataTemp = {
        labels: ['Temperatura Ideal',],
        datasets: [{
            label: 'Temperatura',
            data: dataValueTemp,
            backgroundColor: ['rgba(255, 118, 51, 0.8)', 'rgba(255, 255, 255, 1)'],
            borderColor: ['rgb(255, 118, 22)', 'rgb(255, 118, 22)'],
            borderWidth: 1,
            cutout: '75%',
            radius: '90%',
        }]
    }

    const textoPorcentagemTemp = {
        id: 'textoPorcentagemTemp',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx } = chart;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 21px sans-serif';
            ctx.fillStyle = '#ff7616'
            const texto = `${dataValueTemp[0]}%`;
            const textoWidth = ctx.measureText(texto).width

            const x = chart.getDatasetMeta(0).data[0].x;
            const y = chart.getDatasetMeta(0).data[0].y;
            ctx.fillText(texto, x, y);

        }
    }

    const configTemp = {
        type: 'doughnut',
        data: dataTemp,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Temperatura',
                    color: '#ff7616',
                    font: {
                        size: 20,
                    }
                }
            }
        },
        plugins: [textoPorcentagemTemp],
    }

    const dataValueUr = [79.17, 20.83]
    const dataUr = {
        labels: ['Umidade ideal'],
        datasets: [{
            label: 'Umidade',
            data: dataValueUr,
            backgroundColor: ['rgba(0, 142, 252, 0.8)', 'rgba(255, 255, 255, 1)'],
            borderColor: ['rgb(0, 31, 252)', 'rgb(0, 31, 252)'],
            borderWidth: 1,
            cutout: '75%',
            radius: '90%',
        }]
    }

    const textoPorcentagemUr = {
        id: 'textoPorcentagemUr',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx } = chart;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 21px sans-serif';
            ctx.fillStyle = '#001ffc'
            const texto = `${dataValueUr[0]}%`;
            const textoWidth = ctx.measureText(texto).width


            const x = chart.getDatasetMeta(0).data[0].x;
            const y = chart.getDatasetMeta(0).data[0].y;
            ctx.fillText(texto, x, y);
        }
    }

    const configUr = {
        type: 'doughnut',
        data: dataUr,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Umidade',
                    color: '#001ffc',
                    font: {
                        size: 20,
                    }
                }
            }
        },
        plugins: [textoPorcentagemUr],
    }

    const data = {
        labels: ['Ótimo', 'Normal', 'Ruim'],
        datasets: [{
            label: 'IETP',
            data: [10, 9, 5],
            backgroundColor: [
                'rgb(3, 166, 60)',
                'rgba(159, 159, 159)',
                'rgba(250, 0, 0)',
            ],
            color: 'rgb(3, 166, 60)',
            borderWidth: 1
        }]
    };

    // Calculate percentages
    const total = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
    const percentages = data.datasets[0].data.map(value => ((value / total) * 100).toFixed(2));


    // config
    const config = {
        type: 'pie',
        data: {
            labels: data.labels.map((label, index) => `${label}`),
            datasets: [{
                label: 'IETP',
                data: percentages,
                backgroundColor: data.datasets[0].backgroundColor,
                borderWidth: 1,
                color: '#03A63C',
            }]
        },
        options: {
            scales: {},
            plugins: {
                tooltip: {
                    enabled: false
                },
                datalabels: {
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 14
                    }
                },
            },
        },
        plugins: [ChartDataLabels]
    };

    const kpiTemp = new Chart(ctxTemp, configTemp);
    const kpiUr = new Chart(ctxUr, configUr);
    new Chart(ctxIp, config);
}

function atualizarGrafico(idAmbiente, dados, myChart) {

    fetch(`/medidas/tempo-real/${idAmbiente}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (novoRegistro) {

                obterdados(idAmbiente);
                // alertar(novoRegistro, idAmbiente);
                console.log(`Dados recebidos: ${JSON.stringify(novoRegistro)}`);
                console.log(`Dados atuais do gráfico:`);
                console.log(dados);

                /*                 let avisoCaptura = document.getElementById(`avisoCaptura${idAmbiente}`)
                                avisoCaptura.innerHTML = "" */


                if (novoRegistro[0].momento_grafico == dados.labels[dados.labels.length - 1]) {
                    console.log("---------------------------------------------------------------")
                    console.log("Como não há dados novos para captura, o gráfico não atualizará.")
                    /*                     avisoCaptura.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Foi trazido o dado mais atual capturado pelo sensor. <br> Como não há dados novos a exibir, o gráfico não atualizará." */
                    console.log("Horário do novo dado capturado:")
                    console.log(novoRegistro[0].momento_grafico)
                    console.log("Horário do último dado capturado:")
                    console.log(dados.labels[dados.labels.length - 1])
                    console.log("---------------------------------------------------------------")
                } else {
                    // tirando e colocando valores no gráfico
                    dados.labels.shift(); // apagar o primeiro
                    dados.labels.push(novoRegistro[0].momento_grafico); // incluir um novo momento

                    dados.datasets[0].data.shift();  // apagar o primeiro de umidade
                    dados.datasets[0].data.push(novoRegistro[0].temperatura); // incluir uma nova medida de umidade

                    dados.datasets[1].data.shift();  // apagar o primeiro de temperatura
                    dados.datasets[1].data.push(novoRegistro[0].temperatura); // incluir uma nova medida de temperatura

                    myChart.update();
                }

                // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
                proximaAtualizacao = setTimeout(() => atualizarGrafico(idAmbiente, dados, myChart), 2000);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
            // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
            proximaAtualizacao = setTimeout(() => atualizarGrafico(idAmbiente, dados, myChart), 2000);
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });

}




function atualizacaoPeriodica(idAmbiente) {
    obterdados(idAmbiente)
    setTimeout(atualizacaoPeriodica, 5000);
} 

window.onload = function () {
    exibirDadosAmbiente(sessionStorage.ID_AMBIENTE);
    alterarTitulo(sessionStorage.ID_AMBIENTE);
    atualizacaoPeriodica(sessionStorage.ID_AMBIENTE); 
}
