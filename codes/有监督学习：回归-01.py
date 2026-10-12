import numpy as np
import matplotlib.pyplot as plt
import os

np.random.seed(seed = 1)
X_min = 4
X_max = 30  # 年龄范围在4~30
X_n = 16
X = 5 + 25 * np.random.rand(X_n)
Prm_c = [170, 108, 0.2]
T = Prm_c[0] - Prm_c[1] * np.exp(-Prm_c[2] * X) + 4 * np.random.randn(X_n)

# 数据可视化
plt.figure(figsize = (4, 4))
plt.plot(X, T, marker = 'o', linestyle = 'None', markeredgecolor = 'black', color = 'cornflowerblue')
plt.xlim(X_min, X_max)
base_path = os.path.dirname(__file__)
save_path = os.path.join(base_path, "1.png")
plt.savefig(save_path, dpi=300, bbox_inches="tight")
plt.show()

# 均方误差的梯度
def dmse_line(x, t, w):
    y = w[0] * x + w[1]
    d_w0 = 2 * np.mean((y - t) * x)
    d_w1 = 2 * np.mean(y - t)
    return d_w0, d_w1

# 梯度法求参数
def fit_line_num(x, t):
    w_init = [10.0, 165.0]  # 初始参数
    alpha = 0.001   # 学习率
    tau_max = 100000    # 重复的最大次数
    eps = 0.1   # 停止重复的梯度绝对值的阈值
    w_hist = np.zeros([tau_max, 2])
    w_hist[0, :] = w_init
    for tau in range(1, tau_max):
        dmse = dmse_line(x, t, w_hist[tau - 1])
        w_hist[tau, 0] = w_hist[tau - 1, 0] - alpha * dmse[0]
        w_hist[tau, 1] = w_hist[tau - 1, 1] - alpha * dmse[1]
        if max(np.absolute(dmse)) < eps:
            break
    w0 = w_hist[tau, 0]
    w1 = w_hist[tau, 1]
    w_hist = w_hist[:tau, :]
    return w0, w1, dmse, w_hist

# 结果可视化
W0, W1, dMSE, W_hist = fit_line_num(X, T)
print("W0 = ", np.round(W0, 2), "W1 = ", np.round(W1, 2), "dMSE = ", np.round(dMSE, 2))
plt.figure(figsize = (4, 4))
plt.plot(X, T, marker = 'o', linestyle = 'None', markeredgecolor = 'black', color = 'cornflowerblue')
X_line = np.linspace(X_min, X_max, 100)
Y_line = W0 * X_line + W1
plt.plot(X_line, Y_line, color = 'black', linewidth = 2)
plt.xlim(X_min, X_max)
save_path = os.path.join(base_path, "2.png")
plt.savefig(save_path, dpi=300, bbox_inches="tight")
plt.show()