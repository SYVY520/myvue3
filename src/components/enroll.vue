<template>
<Login :checkPass="code">
  <template #loginD>注册</template>
  <template #code>
      <el-form-item prop="checkPass" >
        <el-input v-model="code" placeholder="请再次输入密码" type="password" show-password/>
      </el-form-item>
  </template>
  <template #login>注册</template>
  <template #zc><a href="/" style="text-decoration: none;color: darkcyan;margin-top: 40px;">点此登录</a></template>
</Login>
</template>

<script setup lang="ts">
import Login from "./login.vue";
import {ref} from "vue";
const code = ref<string>()
</script>
