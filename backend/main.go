package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type ToDo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

var (
	todos []ToDo
	mu    sync.Mutex
)

func main() {
	http.HandleFunc("/", ToDoHandler)
	http.ListenAndServe(":8080", nil)
}

func ToDoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	switch r.Method {
	case http.MethodGet:
		handleGet(w)

	case http.MethodPost:
		handlePost(w, r)

	case http.MethodOptions:
		w.WriteHeader(http.StatusOK)

	default:
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func handleGet(w http.ResponseWriter) {
	mu.Lock()
	defer mu.Unlock()
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(todos)
}

func handlePost(w http.ResponseWriter, r *http.Request) {
	var todo ToDo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if todo.Title == "" || todo.Description == "" {
		http.Error(w, "Title and Description are required", http.StatusBadRequest)
		return
	}

	mu.Lock()
	todos = append(todos, todo)
	mu.Unlock()

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(todo)
}
