export interface OpenKmMetadata {
    NPG_ID: number;
    NPG_GROUP: string;
    NPG_NAME: string;
    NPG_VALUE: string;
    NPG_NODE: string;
}

export interface PublicMethodology {
  nbs_uuid: string;
  nbs_name: string;
  nbs_category: string;
  items: NpgMethodologyItem[];
}

export interface NpgMethodologyItem {
    npg_group: string;
    npg_name: string;
    npg_value: string;
}

export interface PublicMethodologyColumn {
    nbs_uuid: string,
    nbs_name: string,
    nbs_category: string,
    number: string;
    name: string;
    source: string;
    status: string;
    klasifikasi: string;
}