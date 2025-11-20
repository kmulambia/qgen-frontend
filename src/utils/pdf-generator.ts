/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error - pdfmake types may not be available
import pdfMake from 'pdfmake/build/pdfmake'
// @ts-expect-error - pdfmake types may not be available
import pdfFonts from 'pdfmake/build/vfs_fonts'

// Set up pdfMake fonts
if (typeof pdfFonts !== 'undefined' && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
}

import type { IQuotation } from '@/interfaces'

/**
 * Generate PDF document from quotation data
 */
export async function generateQuotationPDF(
  quotation: IQuotation,
  currencySymbol: string
): Promise<void> {
  try {
    // Document definition
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        title: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        subtitle: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 3],
        },
        tableHeader: {
          bold: true,
          fillColor: '#6B21A8', // primary color
          color: '#FFFFFF',
        },
        totalRow: {
          bold: true,
          fontSize: 12,
        },
      },
      content: [
        // Header Section
        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  text: quotation.layout?.company_name || 'Company Name',
                  style: 'header',
                },
                ...(quotation.layout?.description
                  ? [
                      {
                        text: quotation.layout.description,
                        fontSize: 9,
                        color: '#666666',
                      },
                    ]
                  : []),
                ...(quotation.layout?.address
                  ? [{ text: quotation.layout.address, fontSize: 9, margin: [0, 5, 0, 0] }]
                  : []),
                ...(quotation.layout?.phone
                  ? [{ text: `Phone: ${quotation.layout.phone}`, fontSize: 9, margin: [0, 2, 0, 0] }]
                  : []),
                ...(quotation.layout?.email
                  ? [{ text: `Email: ${quotation.layout.email}`, fontSize: 9, margin: [0, 2, 0, 0] }]
                  : []),
              ],
            },
            {
              width: 150,
              stack: [
                {
                  text: 'QUOTATION',
                  style: 'header',
                  alignment: 'right',
                },
                ...(quotation.title
                  ? [
                      {
                        text: quotation.title.toUpperCase(),
                        fontSize: 10,
                        bold: true,
                        alignment: 'right',
                        margin: [0, 5, 0, 0],
                      },
                    ]
                  : []),
                ...(quotation.description
                  ? [
                      {
                        text: quotation.description,
                        fontSize: 9,
                        color: '#666666',
                        alignment: 'right',
                        margin: [0, 5, 0, 0],
                      },
                    ]
                  : []),
              ],
            },
          ],
          margin: [0, 0, 0, 30],
        },

        // Details Section
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'Bill to', style: 'subtitle' },
                {
                  text: quotation.client?.company_name || 'Client Name',
                  bold: true,
                  fontSize: 11,
                  margin: [0, 0, 0, 5],
                },
                ...(quotation.client?.email
                  ? [{ text: quotation.client.email, fontSize: 9, margin: [0, 2, 0, 0] }]
                  : []),
                ...(quotation.client?.phone
                  ? [{ text: quotation.client.phone, fontSize: 9, margin: [0, 2, 0, 0] }]
                  : []),
              ],
            },
            {
              width: 200,
              stack: [
                {
                  columns: [
                    { text: 'Estimate number:', width: '*' },
                    {
                      text: quotation.quotation_number || 'N/A',
                      bold: true,
                      alignment: 'right',
                    },
                  ],
                  margin: [0, 0, 0, 5],
                },
                {
                  columns: [
                    { text: 'Date:', width: '*' },
                    {
                      text: quotation.quotation_date || 'N/A',
                      alignment: 'right',
                    },
                  ],
                  margin: [0, 0, 0, 5],
                },
                {
                  columns: [
                    { text: 'Valid until:', width: '*' },
                    {
                      text: quotation.valid_until || 'N/A',
                      alignment: 'right',
                    },
                  ],
                  margin: [0, 0, 0, 5],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Line Items Table
        {
          table: {
            headerRows: 1,
            widths: [300, 60, 80, 80], // Fixed widths: items column takes remaining space
            body: [
              // Header row
              [
                { text: 'Items', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader', alignment: 'center' },
                { text: 'Price', style: 'tableHeader', alignment: 'right' },
                { text: 'Amount', style: 'tableHeader', alignment: 'right' },
              ],
              // Data rows
              ...(quotation.items?.map((item) => [
                {
                  text: item.description?.split('\n')[0] || 'Item',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: item.quantity.toString(),
                  alignment: 'center',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${currencySymbol}${item.unit_price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${currencySymbol}${(item.quantity * item.unit_price).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ]) || []),
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
            vLineWidth: () => 0.5,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
          margin: [0, 0, 0, 20],
        },

        // Totals Section
        {
          columns: [
            { width: '*' },
            {
              width: 200,
              stack: [
                {
                  columns: [
                    { text: 'Subtotal:', width: '*' },
                    {
                      text: `${currencySymbol}${quotation.subtotal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                      alignment: 'right',
                    },
                  ],
                  margin: [0, 0, 0, 5],
                },
                ...(quotation.discount_percentage && quotation.discount_percentage > 0
                  ? [
                      {
                        columns: [
                          {
                            text: `Discount (${quotation.discount_percentage}%):`,
                            width: '*',
                          },
                          {
                            text: `-${currencySymbol}${quotation.discount_amount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`,
                            alignment: 'right',
                            color: '#DC2626',
                          },
                        ],
                        margin: [0, 0, 0, 5],
                      },
                    ]
                  : []),
                ...(quotation.tax_percentage && quotation.tax_percentage > 0
                  ? [
                      {
                        columns: [
                          { text: `Tax (${quotation.tax_percentage}%):`, width: '*' },
                          {
                            text: `${currencySymbol}${quotation.tax_amount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`,
                            alignment: 'right',
                          },
                        ],
                        margin: [0, 0, 0, 5],
                      },
                    ]
                  : []),
                {
                  columns: [
                    { text: 'Total:', style: 'totalRow', width: '*' },
                    {
                      text: `${currencySymbol}${quotation.total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                      style: 'totalRow',
                      alignment: 'right',
                    },
                  ],
                  margin: [20, 10, 0, 0],
                  border: [false, true, false, false],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Notes Section
        ...(quotation.notes
          ? [
              {
                text: 'Notes',
                style: 'title',
              },
              {
                text: quotation.notes,
                fontSize: 9,
                margin: [0, 0, 0, 15],
              },
            ]
          : []),

        // Terms & Conditions Section
        ...(quotation.terms_conditions
          ? [
              {
                text: 'Terms & Conditions',
                style: 'title',
              },
              {
                text: quotation.terms_conditions,
                fontSize: 9,
              },
            ]
          : []),
      ],
      info: {
        title: `Quotation ${quotation.quotation_number || ''}`,
        author: quotation.layout?.company_name || 'Company',
        subject: `Quotation for ${quotation.client?.company_name || 'Client'}`,
      },
    }

    // Generate and download PDF
    const pdfDoc = pdfMake.createPdf(docDefinition as any)
    const filename = `Quotation_${quotation.quotation_number || quotation.id || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`

    pdfDoc.download(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF document')
  }
}

