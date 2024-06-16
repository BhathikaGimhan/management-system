import React, { useEffect, useState } from 'react';
import { Br, Cut, Line, Printer, Text, Row, render } from 'react-thermal-printer';

const ThermalPrint = ({ selectedInvoice }) => {

  console.log(selectedInvoice);
  useEffect(() => {
    const generateReceipt = async () => {
        <Printer type="epson" width={42} >
          <Text size={{ width: 2, height: 2 }}>Invoice</Text>
          <Text bold={true}>{selectedInvoice?.Invoice_Number}</Text>
          <Br />
          <Line />
          <Row left="Name" right="체크카드" />
          <Row left="Date" right={selectedInvoice?.Name} />
          <Row left="Discount_Presentage" right={selectedInvoice?.Discount_Presentage} />
          {/* <Row left="결제금액" right="9,500" />
          <Row left="부가세액" right="863" />
          <Row left="공급가액" right="8,637" />
          <Line />
          <Row left="맛있는 옥수수수염차 X 2" right="11,000" />
          <Text>옵션1(500)/옵션2/메모</Text>
          <Row left="(-) 할인" right="- 500" />
          <Br />
          <Line />
          <Row left="합계" right="9,500" />
          <Row left="(-) 할인 2%" right="- 1,000" />
          <Line />
          <Row left="대표" right="김대표" />
          <Row left="사업자등록번호" right="000-00-00000" />
          <Row left="대표번호" right="0000-0000" />
          <Row left="주소" right="어디시 어디구 어디동 몇동몇호" /> */}
          <Line />
          <Br />
          <Text align="center">Wifi: some-wifi / PW: 123123</Text>
          <Cut />
        </Printer>
    };

    generateReceipt();
  }, []);

  return null;
};

export default ThermalPrint;
