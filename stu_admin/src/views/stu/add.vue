<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="600"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formModel.sex">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生年月" prop="birthday">
        <el-date-picker
          v-model="formModel.birthday"
          type="date"
          placeholder="请选择"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="所在班级" prop="class">
        <el-input v-model="formModel.class" />
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input v-model="formModel.address" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose()">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import { ElMessage } from 'element-plus';
import { update, save } from '@/api/stu';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  info: {
    type: Object,
    default: () => {}
  },
})
const emit = defineEmits(['update:modelValue', 'callback'])
const { modelValue, title, info } = toRefs(props)
const loading = ref(false)
const formRef = ref()
const formModel = ref({
  name: '',
  sex: 1,
  birthday: '',
  class: '',
  address: ''
})

watch(modelValue, (val) => {
  if (val) {
    info.value && (formModel.value = info.value)
  }
})

const rules = reactive({
  name: [{ required: true, message: '请输入姓名' }],
  sex: [{ required: true, message: '请选择性别' }],
})

const handleClose = () => {
  formModel.value = {
    name: '',
    sex: 1,
    birthday: '',
    class: '',
    address: ''
  }
  formRef.value.resetFields()
  emit('update:modelValue')
}

const handleSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const params = {
        ...formModel.value
      }
      let method = save
      if (params._id) {
        method = update
      }
      loading.value = true
      method(params).then(res => {
        if (res) {
          ElMessage.success('操作成功')
          emit('callback')
          handleClose()
        }
      }).finally(() => {
        loading.value = false
      })
    }
  })
}

</script>
<style scoped lang='scss'>
</style>
