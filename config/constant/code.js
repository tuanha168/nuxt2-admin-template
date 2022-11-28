export const CodeConstant = Object.freeze({
  CRUMBS: [
    {
      path: '/',
      icon: 'home',
      breadcrumbName: 'home'
    },
    {
      path: '/codes',
      breadcrumbName: 'Codes'
    }
  ],
  COLUMNS: [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      scopedSlots: { customRender: 'id' },
      width: 220
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Status',
      dataIndex: 'is_activated',
      key: 'is_activated',
      align: 'center',
      scopedSlots: { customRender: 'status' },
      width: 100
    },
    {
      title: 'Expired Time',
      dataIndex: 'expired_time',
      key: 'expired_time',
      align: 'center',
      scopedSlots: { customRender: 'timeFormat' }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      scopedSlots: { customRender: 'timeFormat' }
    }
  ]
})
