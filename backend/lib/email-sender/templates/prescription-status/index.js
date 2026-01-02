const prescriptionStatusEmailBody = (option) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${option.name},</h2>
      <p>Your prescription uploaded on <strong>${option.date}</strong> has been updated.</p>
      
      <h3 style="color: ${option.status === 'processed' ? 'green' : 'red'}; text-transform: capitalize;">
        Status: ${option.status === 'processed' ? 'Approved' : option.status}
      </h3>

      ${
        option.status === 'processed'
          ? `<p>Your prescription has been approved! The following medicines have been added to your prescription list:</p>
             <ul>
               ${option.medicines
                 .map(
                   (med) =>
                     `<li><strong>${med.title}</strong> - Qty: ${med.quantity} ${
                       med.dosage ? `(Dosage: ${med.dosage})` : ""
                     }</li>`
                 )
                 .join("")}
             </ul>
             <p>You can now proceed to checkout from your dashboard.</p>`
          : `<p>Unfortunately, your prescription was rejected.</p>
             ${option.notes ? `<p><strong>Reason:</strong> ${option.notes}</p>` : ""}
             <p>Please upload a valid prescription or contact support.</p>`
      }

      <br/>
      <p>Thank you for choosing ${option.company_name}!</p>
    </div>
  `;
};

module.exports = prescriptionStatusEmailBody;
