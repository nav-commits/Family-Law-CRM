export type ClientData = {
    id?: string;
    status: string;
    priority?: "high" | "medium" | "low";
    billableHours?: number; 
    clientInfo: {
      howHeard: string;
      name: string;
      dateOfBirth: string;
      placeOfBirth: string;
      citizenship: string;
      surnameAtBirth: string;
      arrivedInBC: string;
      usCitizen: string;
      address: string;
      mailingAddress: string;
      home: string;
      work: string;
      mobile: string;
      email: string;
      occupation: string;
      employer: string;
      annualIncome: string;
      otherIncome: string;
    }; 
    adverseParty: {
      name: string;
      surnameAtBirth: string;
      otherNames: string;
      dateOfBirth: string;
      placeOfBirth: string;
      address: string;
      arrivedInBC: string;
      occupation: string;
      employer: string;
      income: string;
      otherIncome: string;
      lawyer: {
        name: string;
        firm: string;
        address: string;
        phone: string;
        fax: string;
        email: string;
      };
    }; 
    relationship: {
      cohabitationDate: string;
      marriageDate: string;
      marriagePlace: string;
      separationDate: string;
      hasAgreement: string;
      divorced: string;
      hasMarriageCertificate: string;
    }; 
    children: {
      details: string;
      custodySought: string;
      custodyTerms: string;
    }; 
    assets: {
      summary: string;
      rrsp: string;
      privatePensions: string;
      investments: string;
      businessInterests: string;
      automobiles: string;
      debts: string;
    };
    notes: string;
  };
  