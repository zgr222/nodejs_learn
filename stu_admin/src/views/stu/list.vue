<template>
  <div class="wrapper">
    <div>
      <el-form :model="seekForm" inline>
        <el-form-item prop="name">
          <el-input
            v-model="seekForm.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex">
          <el-select v-model="seekForm.sex" style="width: 200px" placeholder="请选择">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="seek">查询</el-button>
          <el-button @click="resetSeek">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="success" icon="plus" @click="openAddDialog('新增学生')">新增学生</el-button>
    </div>
    <el-table
      v-loading="tableData.loading"
      :data="tableData.list"
      border
      height="600px"
      style="margin: 20px 0;"
    >
      <el-table-column label="ID" prop="_id"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="sex">
        <template #default="{ row }">
          {{ row.sex ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="出生年月" prop="birthday"></el-table-column>
      <el-table-column label="所处班级" prop="class"></el-table-column>
      <el-table-column label="家庭住址" prop="address"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="openAddDialog('编辑学生信息', row)">编辑</el-button>
          <el-button type="danger" @click="tableDelete('确认删除该学生信息？', row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="page.pageSizes"
      :pageSize="page.pageSize"
      :layout="page.layout"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <addDialog
    v-model="addModel.visible"
    :title="addModel.title"
    :info="addModel.info"
    @callback="closeAddDialog"
  />
</template>

<script setup>
import addDialog from './add.vue';
import {
  getList,
  detale
} from '@/api/stu';
import UseTable from '@/hooks/UseTable.js';

const {
  seekForm,
  page,
  tableData,
  addModel,
  handleCurrentChange,
  handleSizeChange,
  openAddDialog,
  closeAddDialog,
  tableDelete,
  seek,
  resetSeek
} = UseTable(
  {getList, detale},
  {
    name: '',
    sex: ''
  }
)


</script>
<style scoped lang='scss'>
.wrapper {
  padding: 20px;
}
</style>