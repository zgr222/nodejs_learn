import { ElMessage, ElMessageBox } from "element-plus";

/**
 * 
 * @param {*} apis 对应的api请求
 * @param {*} seekItem 查询参数列表
 * @param {*} requireParams 需要的必传参数
 */
export default function UseTable(apis = {}, seekItem = {}, requireParams = {}) {
  const tableData = reactive({
    loading: false,
    list: []
  })
  // 分页对象信息
  const page = reactive({
    pageNum: 1,
    pageSize: 20,
    total: 0,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100, 200]
  });

  // 列表查询参数对象
  const seekForm = reactive({
    ...seekItem
  });

  // 请求列表
  const getTableData = () => {
    return new Promise(async (resolve) => {
      if (apis.getList) {
        try {
          tableData.loading = true
          const data = await apis.getList({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            ...seekForm,
            ...requireParams
          })
          tableData.loading = false
          if (data) {
            tableData.list = Array.isArray(data) ? data : data.list || []
            page.total = data.total
            resolve(data)
          } else {
            tableData.list = []
            resolve(false)
          }
        } catch (error) {
          console.log('error :>> ', error);
        }
      }
    })
  }

  // 删除
  const tableDelete = (data, tip) => {
    return new Promise((resolve, reject) => {
      if (apis.detale) {
        ElMessageBox.confirm(tip || '确认删除当前项目？', '删除提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(async() => {
          try {
            const d = await apis.detale({...data})
            if (d) {
              ElMessage.success('删除成功')
              getTableData()
              resolve()
            }
          } catch (error) {
            console.log('error :>> ', error);
            reject()
          }
        })
      }
    })
  }

  // 查询函数
  const seek = () => {
    return new Promise(async(resolve) => {
      page.pageNum = 1
      const res = await getTableData()
      resolve(res || false)
    })
  }

  // 重置搜索
  const resetSeek = () => {
    for (const i in seekItem) {
      seekForm[i] = seekItem[i];   
    }
    seek()
  }

  // 分页
  const handleSizeChange = (size) => {
    page.pageSize = size;
    getTableData();
  }
  const handleCurrentChange = (num) => {
    page.pageNum = num;
    getTableData();
  }

  // 添加弹窗
  const addModel = reactive({
    visible: false,
    title: '新增',
    info: null
  })
  const openAddDialog = (title = '新增', row = null) => {
    addModel.title = title
    addModel.info = row ? { ...row } : null
    addModel.visible = true
  }
  const closeAddDialog = () => {
    addModel.visible = false
    page.pageNum = 1
    getTableData()
  }

  onMounted(() => {
    getTableData()
  })

  return {
    tableData,
    page,
    seekForm,
    addModel,
    seek,
    resetSeek,
    getTableData,
    tableDelete,
    handleCurrentChange,
    handleSizeChange,
    openAddDialog,
    closeAddDialog
  }
}