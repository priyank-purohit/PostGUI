import { IAppConfigContextValues } from 'contexts/app-config-context';

import { LOCAL_APP_CONFIGURATION } from './config.local';


/**
 * Gets overriden by local app configuration.
 */
export const APP_CONFIGURATION: IAppConfigContextValues = {
  databases: [
    {
      title: 'DVD Rentals',
      baseUrl: 'http://localhost:3001',
      publicDbAcessType: 'read',
      foreignKeySearch: true,
      primaryKeyFunction: true,
      regexSupport: false
    }
  ],
  logoUrl: null,
  seqColumnNames: [
    'alignment_sequence',
    'nucleotide_sequence',
    'aminoacid_sequence',
    'nucleotide_seq',
    'amino_acid_seq',
    'nuc_seq',
    'aa_seq',
    'dna_seq',
    'protein_seq',
    'prot_seq',
    'n_seq',
    'p_seq',
    'a_seq',
    'seq',
    'sequence'
  ],
  ...LOCAL_APP_CONFIGURATION
}
